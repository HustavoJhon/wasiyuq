import type { Socket, TCPSocketListener } from "bun";

/**
 * Minimal scripted SMTP server for tests. It speaks just enough RFC 5321 for nodemailer (no TLS, no AUTH) and
 * can answer RCPT TO / end-of-DATA with a chosen reply code, so provider failures are reproducible offline.
 */
export interface FakeSmtpOptions {
  /** Reply to RCPT TO for each successive message (index = message number); default 250. */
  rcptReplies?: number[];
}

export interface FakeSmtp {
  port: number;
  /** Raw DATA payloads of accepted messages. */
  messages: string[];
  /** Number of RCPT TO commands received (accepted or not). */
  attempts(): number;
  stop(): void;
}

interface State {
  buffer: string;
  inData: boolean;
  data: string[];
}

export function startFakeSmtp(options: FakeSmtpOptions = {}): FakeSmtp {
  const messages: string[] = [];
  let rcptCount = 0;
  const reply = (socket: Socket<State>, line: string) => socket.write(`${line}\r\n`);

  const listener: TCPSocketListener<State> = Bun.listen<State>({
    hostname: "127.0.0.1",
    port: 0,
    socket: {
      open(socket) {
        socket.data = { buffer: "", inData: false, data: [] };
        reply(socket, "220 fake-smtp ready");
      },
      data(socket, chunk) {
        const state = socket.data;
        state.buffer += chunk.toString();
        let index: number;
        while ((index = state.buffer.indexOf("\r\n")) >= 0) {
          const line = state.buffer.slice(0, index);
          state.buffer = state.buffer.slice(index + 2);
          if (state.inData) {
            if (line === ".") {
              state.inData = false;
              messages.push(state.data.join("\n"));
              state.data = [];
              reply(socket, "250 2.0.0 queued");
            } else state.data.push(line);
            continue;
          }
          const command = line.slice(0, 4).toUpperCase();
          if (command === "EHLO" || command === "HELO") reply(socket, "250 fake-smtp");
          else if (command === "MAIL") reply(socket, "250 2.1.0 ok");
          else if (command === "RCPT") {
            const code = options.rcptReplies?.[rcptCount] ?? 250;
            rcptCount++;
            reply(socket, code === 250 ? "250 2.1.5 ok" : `${code} ${code >= 500 ? "5.1.1 rejected" : "4.3.0 try again later"}`);
          } else if (command === "DATA") {
            state.inData = true;
            reply(socket, "354 end with .");
          } else if (command === "RSET" || command === "NOOP") reply(socket, "250 ok");
          else if (command === "QUIT") {
            reply(socket, "221 bye");
            socket.end();
          } else reply(socket, "502 not implemented");
        }
      },
    },
  });

  return {
    port: listener.port,
    messages,
    attempts: () => rcptCount,
    stop: () => listener.stop(true),
  };
}
