export function parseFasta(input: string) {
    const lines = input.trim().split(/\r?\n/);
    const sequences: { id: string; seq: string }[] = [];
    let currentId = "seq";
    let buffer: string[] = [];

    lines.forEach((line) => {
        if (line.startsWith(">")) {
            if (buffer.length) {
                sequences.push({ id: currentId, seq: buffer.join("") });
                buffer = [];
            }
            currentId = line.replace(/^>\s*/, "") || `seq-${sequences.length + 1}`;
        } else if (line.trim()) {
            buffer.push(line.trim());
        }
    });

    if (buffer.length) {
        sequences.push({ id: currentId, seq: buffer.join("") });
    }

    return sequences;
}

