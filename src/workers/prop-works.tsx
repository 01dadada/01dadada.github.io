const protein_weights: Record<string, number> = {
    "A": 89.0932, "C": 121.1582, "D": 133.1027, "E": 147.1293, "F": 165.1891,
    "G": 75.0666, "H": 155.1546, "I": 131.1729, "K": 146.1876, "L": 131.1729,
    "M": 149.2113, "N": 132.1179, "O": 255.3134, "P": 115.1305, "Q": 146.1445,
    "R": 174.201, "S": 105.0926, "T": 119.1192, "U": 168.0532, "V": 117.1463,
    "W": 204.2252, "Y": 181.1885
};

const monoisotopic_protein_weights: Record<string, number> = {
    "A": 89.047678, "C": 121.019749, "D": 133.037508, "E": 147.053158, "F": 165.078979,
    "G": 75.032028, "H": 155.069477, "I": 131.094629, "K": 146.105528, "L": 131.094629,
    "M": 149.051049, "N": 132.053492, "O": 255.158292, "P": 115.063329, "Q": 146.069142,
    "R": 174.111676, "S": 105.042593, "T": 119.058243, "U": 168.964203, "V": 117.078979,
    "W": 204.089878, "Y": 181.073893
};

const kd: Record<string, number> = {
    "A": 1.8, "R": -4.5, "N": -3.5, "D": -3.5, "C": 2.5,
    "Q": -3.5, "E": -3.5, "G": -0.4, "H": -3.2, "I": 4.5,
    "L": 3.8, "K": -3.9, "M": 1.9, "F": 2.8, "P": -1.6,
    "S": -0.8, "T": -0.7, "W": -0.9, "Y": -1.3, "V": 4.2
};

const ab: Record<string, number> = {
    "A": 5.1, "R": 2.0, "N": 0.6, "D": 0.7, "C": 0.0,
    "Q": 1.4, "E": 1.8, "G": 4.1, "H": 1.6, "I": 9.3,
    "L": 10.0, "K": 1.3, "M": 8.7, "F": 9.6, "P": 4.9,
    "S": 3.1, "T": 3.5, "W": 9.2, "Y": 8.0, "V": 8.5
};

const al: Record<string, number> = {
    "A": 0.44, "R": -2.42, "N": -1.32, "D": -0.31, "C": 0.58,
    "Q": -0.71, "E": -0.34, "G": 0.0, "H": -0.01, "I": 2.46,
    "L": 2.46, "K": -2.45, "M": 1.1, "F": 2.54, "P": 1.29,
    "S": -0.84, "T": -0.41, "W": 2.56, "Y": 1.63, "V": 1.73
};

const ag: Record<string, number> = {
    "A": 0.61, "R": 0.6, "N": 0.06, "D": 0.46, "C": 1.07,
    "Q": 0.0, "E": 0.47, "G": 0.07, "H": 0.61, "I": 2.22,
    "L": 1.53, "K": 1.15, "M": 1.18, "F": 2.02, "P": 1.95,
    "S": 0.05, "T": 0.05, "W": 2.65, "Y": 1.88, "V": 1.32
};

const bm: Record<string, number> = {
    "A": 0.616, "R": 0.0, "N": 0.236, "D": 0.028, "C": 0.68,
    "Q": 0.251, "E": 0.043, "G": 0.501, "H": 0.165, "I": 0.943,
    "L": 0.943, "K": 0.283, "M": 0.738, "F": 1.0, "P": 0.711,
    "S": 0.359, "T": 0.45, "W": 0.878, "Y": 0.88, "V": 0.825
};

const bb: Record<string, number> = {
    "A": 0.61, "R": 0.69, "N": 0.89, "D": 0.61, "C": 0.36,
    "Q": 0.97, "E": 0.51, "G": 0.81, "H": 0.69, "I": -1.45,
    "L": -1.65, "K": 0.46, "M": -0.66, "F": -1.52, "P": -0.17,
    "S": 0.42, "T": 0.29, "W": -1.2, "Y": -1.43, "V": -0.75
};

const cs: Record<string, number> = {
    "A": 0.2, "R": -0.7, "N": -0.5, "D": -1.4, "C": 1.9,
    "Q": -1.1, "E": -1.3, "G": -0.1, "H": 0.4, "I": 1.4,
    "L": 0.5, "K": -1.6, "M": 0.5, "F": 1.0, "P": -1.0,
    "S": -0.7, "T": -0.4, "W": 1.6, "Y": 0.5, "V": 0.7
};

const ci: Record<string, number> = {
    "A": 0.02, "R": -0.42, "N": -0.77, "D": -1.04, "C": 0.77,
    "Q": -1.1, "E": -1.14, "G": -0.8, "H": 0.26, "I": 1.81,
    "L": 1.14, "K": -0.41, "M": 1.0, "F": 1.35, "P": -0.09,
    "S": -0.97, "T": -0.77, "W": 1.71, "Y": 1.11, "V": 1.13
};

const cw: Record<number, Record<string, number>> = {
    3.4: {
        "A": 0.42, "R": -1.56, "N": -1.03, "D": -0.51, "C": 0.84,
        "Q": -0.96, "E": -0.37, "G": 0.0, "H": -2.28, "I": 1.81,
        "L": 1.8, "K": -2.03, "M": 1.18, "F": 1.74, "P": 0.86,
        "S": -0.64, "T": -0.26, "W": 1.46, "Y": 0.51, "V": 1.34
    },
    7.5: {
        "A": 0.35, "R": -1.5, "N": -0.99, "D": -2.15, "C": 0.76,
        "Q": -0.93, "E": -1.95, "G": 0.0, "H": -0.65, "I": 1.83,
        "L": 1.8, "K": -1.54, "M": 1.1, "F": 1.69, "P": 0.84,
        "S": -0.63, "T": -0.27, "W": 1.35, "Y": 0.39, "V": 1.32
    }
};

const es: Record<string, number> = {
    "A": 0.62, "R": -2.53, "N": -0.78, "D": -0.9, "C": 0.29,
    "Q": -0.85, "E": -0.74, "G": 0.48, "H": -0.4, "I": 1.38,
    "L": 1.06, "K": -1.5, "M": 0.64, "F": 1.19, "P": 0.12,
    "S": -0.18, "T": -0.05, "W": 0.81, "Y": 0.26, "V": 1.08
};

const eg: Record<string, number> = {
    "A": -1.6, "R": 12.3, "N": 4.8, "D": 9.2, "C": -2,
    "Q": 4.1, "E": 8.2, "G": -1, "H": 3, "I": -3.1,
    "L": -2.8, "K": 8.8, "M": -3.4, "F": -3.7, "P": 0.2,
    "S": -0.6, "T": -1.2, "W": -1.9, "Y": 0.7, "V": -2.6
};

const fs: Record<string, number> = {
    "A": -0.21, "R": 2.11, "N": 0.96, "D": 1.36, "C": -6.04,
    "Q": 1.52, "E": 2.3, "G": 0, "H": -1.23, "I": -4.81,
    "L": -4.68, "K": 3.88, "M": -3.66, "F": -4.65, "P": 0.75,
    "S": 1.74, "T": 0.78, "W": -3.32, "Y": -1.01, "V": -3.5
};

const fc: Record<string, number> = {
    "A": 0.31, "R": -1.01, "N": -0.6, "D": -0.77, "C": 1.54,
    "Q": -0.22, "E": -0.64, "G": 0, "H": 0.13, "I": 1.8,
    "L": 1.7, "K": -0.99, "M": 1.23, "F": 1.79, "P": 0.72,
    "S": -0.04, "T": 0.26, "W": 2.25, "Y": 0.96, "V": 1.22
};

const gd: Record<string, number> = {
    "A": 0.75, "R": 0.75, "N": 0.69, "D": 0, "C": 1,
    "Q": 0.59, "E": 0, "G": 0, "H": 0, "I": 2.95,
    "L": 2.4, "K": 1.5, "M": 1.3, "F": 2.65,
    "P": 2.6, "S": 0, "T": 0.45, "W": 3, "Y": 2.85, "V": 1.7
};

const gy: Record<string, number> = {
    "A": 0.1, "R": 1.91, "N": 0.48, "D": 0.78, "C": -1.42,
    "Q": 0.95, "E": 0.83, "G": 0.33, "H": -0.5, "I": -1.13,
    "L": -1.18, "K": 1.4, "M": -1.59, "F": -2.12, "P": 0.73,
    "S": 0.52, "T": 0.07, "W": -0.51, "Y": -0.21, "V": -1.27
};

const jo: Record<string, number> = {
    "A": 0.87, "R": 0.85, "N": 0.09, "D": 0.66, "C": 1.52,
    "Q": 0, "E": 0.67, "G": 0.1, "H": 0.87, "I": 3.15,
    "L": 2.17, "K": 1.64, "M": 1.67, "F": 2.87, "P": 2.77,
    "S": 0.07, "T": 0.07, "W": 3.77, "Y": 2.67, "V": 1.87
};

const ju: Record<string, number> = {
    "A": 1.1, "R": -5.1, "N": -3.5, "D": -3.6, "C": 2.5,
    "Q": -3.68, "E": -3.2, "G": -0.64, "H": -3.2, "I": 4.5,
    "L": 3.8, "K": -4.11, "M": 1.9, "F": 2.8, "P": -1.9,
    "S": -0.5, "T": -0.7, "W": -0.46, "Y": -1.3, "V": 4.2
};

const ki: Record<string, number> = {
    "A": -0.27, "R": 1.87, "N": 0.81, "D": 0.81, "C": -1.05,
    "Q": 1.1, "E": 1.17, "G": -0.16, "H": 0.28, "I": -0.77,
    "L": -1.1, "K": 1.7, "M": -0.73, "F": -1.43, "P": -0.75,
    "S": 0.42, "T": 0.63, "W": -1.57, "Y": -0.56, "V": -0.4
};

const mi: Record<string, number> = {
    "A": 5.33, "R": 4.18, "N": 3.71, "D": 3.59, "C": 7.93,
    "Q": 3.87, "E": 3.65, "G": 4.48, "H": 5.1, "I": 8.83,
    "L": 8.47, "K": 2.95, "M": 8.95, "F": 9.03, "P": 3.87,
    "S": 4.09, "T": 4.49, "W": 7.66, "Y": 5.89, "V": 7.63
};

const pa: Record<string, number> = {
    "A": 2.1, "R": 4.2, "N": 7, "D": 10, "C": 1.4,
    "Q": 6, "E": 7.8, "G": 5.7, "H": 2.1, "I": -8,
    "L": -9.2, "K": 5.7, "M": -4.2, "F": -9.2, "P": 2.1,
    "S": 6.5, "T": 5.2, "W": -10, "Y": -1.9, "V": -3.7
};

const po: Record<string, number> = {
    "A": 0.85, "R": 0.2, "N": -0.48, "D": -1.1, "C": 2.1,
    "Q": -0.42, "E": -0.79, "G": 0, "H": 0.22, "I": 3.14,
    "L": 1.99, "K": -1.19, "M": 1.42, "F": 1.69, "P": -1.14,
    "S": -0.52, "T": -0.08, "W": 1.76, "Y": 1.37, "V": 2.53
};

const ro: Record<string, number> = {
    "A": 0.74, "R": 0.64, "N": 0.63, "D": 0.62, "C": 0.91,
    "Q": 0.62, "E": 0.62, "G": 0.72, "H": 0.78, "I": 0.88,
    "L": 0.85, "K": 0.52, "M": 0.85, "F": 0.88, "P": 0.64,
    "S": 0.66, "T": 0.7, "W": 0.85, "Y": 0.76, "V": 0.86
};

const rm: Record<string, number> = {
    "A": 0.39, "R": -3.95, "N": -1.91, "D": -3.81, "C": 0.25,
    "Q": -1.3, "E": -2.91, "G": 0, "H": -0.64, "I": 1.82,
    "L": 1.82, "K": -2.77, "M": 0.96, "F": 2.27, "P": 0.99,
    "S": -1.24, "T": -1, "W": 2.13, "Y": 1.47, "V": 1.3
};

const sw: Record<string, number> = {
    "A": -0.4, "R": -0.59, "N": -0.92, "D": -1.31, "C": 0.17,
    "Q": -0.91, "E": -1.22, "G": -0.67, "H": -0.64, "I": 1.25,
    "L": 1.22, "K": -0.67, "M": 1.02, "F": 1.92, "P": -0.49,
    "S": -0.55, "T": -0.28, "W": 0.5, "Y": 1.67, "V": 0.91
};

const ta: Record<string, number> = {
    "A": 0.62, "R": -2.53, "N": -0.78, "D": -0.09, "C": 0.29,
    "Q": -0.85, "E": -0.74, "G": 0.48, "H": -0.4, "I": 1.38,
    "L": 1.53, "K": -1.5, "M": 0.64, "F": 1.19, "P": 0.12,
    "S": -0.18, "T": -0.05, "W": 0.81, "Y": 0.26, "V": 1.8
};

const wi: Record<string, number> = {
    "A": -0.3, "R": -1.1, "N": -0.2, "D": -1.4, "C": 6.3,
    "Q": -0.2, "E": 0, "G": 1.2, "H": -1.3, "I": 4.3,
    "L": 6.6, "K": -3.6, "M": 2.5, "F": 7.5, "P": 2.2,
    "S": -0.6, "T": -2.2, "W": 7.9, "Y": 7.1, "V": 5.9
};

const zi: Record<string, number> = {
    "A": 0.83, "R": 0.83, "N": 0.09, "D": 0.64, "C": 1.48,
    "Q": 0, "E": 0.65, "G": 0.1, "H": 1.1, "I": 3.07,
    "L": 2.52, "K": 1.6, "M": 1.4, "F": 2.75, "P": 2.7,
    "S": 0.14, "T": 0.54, "W": 0.31, "Y": 2.97, "V": 1.79
};

const gravy_scales: Record<string, Record<string, number>> = {
    "KyteDoolitle": kd,
    "Aboderin": ab,
    "AbrahamLeo": al,
    "Argos": ag,
    "BlackMould": bm,
    "BullBreese": bb,
    "Casari": cs,
    "Cid": ci,
    "Cowan3.4": cw[3.4],
    "Cowan7.5": cw[7.5],
    "Eisenberg": es,
    "Engelman": eg,
    "Fasman": fs,
    "Fauchere": fc,
    "GoldSack": gd,
    "Guy": gy,
    "Jones": jo,
    "Juretic": ju,
    "Kidera": ki,
    "Miyazawa": mi,
    "Parker": pa,
    "Ponnuswamy": po,
    "Rose": ro,
    "Roseman": rm,
    "Sweet": sw,
    "Tanford": ta,
    "Wilson": wi,
    "Zimmerman": zi
};

// Flexibility scale
const Flex: Record<string, number> = {
    "A": 0.984, "C": 0.906, "E": 1.094, "D": 1.068, "G": 1.031,
    "F": 0.915, "I": 0.927, "H": 0.950, "K": 1.102, "M": 0.952,
    "L": 0.935, "N": 1.048, "Q": 1.037, "P": 1.049, "S": 1.046,
    "R": 1.008, "T": 0.997, "W": 0.904, "V": 0.931, "Y": 0.929
};

// Instability index (DIWV) - dipeptide values
const DIWV: Record<string, Record<string, number>> = {
    "A": { "A": 1.0, "C": 44.94, "E": 1.0, "D": -7.49, "G": 1.0, "F": 1.0, "I": 1.0, "H": -7.49, "K": 1.0, "M": 1.0, "L": 1.0, "N": 1.0, "Q": 1.0, "P": 20.26, "S": 1.0, "R": 1.0, "T": 1.0, "W": 1.0, "V": 1.0, "Y": 1.0 },
    "C": { "A": 1.0, "C": 1.0, "E": 1.0, "D": 20.26, "G": 1.0, "F": 1.0, "I": 1.0, "H": 33.60, "K": 1.0, "M": 33.60, "L": 20.26, "N": 1.0, "Q": -6.54, "P": 20.26, "S": 1.0, "R": 1.0, "T": 33.60, "W": 24.68, "V": -6.54, "Y": 1.0 },
    "E": { "A": 1.0, "C": 44.94, "E": 33.60, "D": 20.26, "G": 1.0, "F": 1.0, "I": 20.26, "H": -6.54, "K": 1.0, "M": 1.0, "L": 1.0, "N": 1.0, "Q": 20.26, "P": 20.26, "S": 20.26, "R": 1.0, "T": 1.0, "W": -14.03, "V": 1.0, "Y": 1.0 },
    "D": { "A": 1.0, "C": 1.0, "E": 1.0, "D": 1.0, "G": 1.0, "F": -6.54, "I": 1.0, "H": 1.0, "K": -7.49, "M": 1.0, "L": 1.0, "N": 1.0, "Q": 1.0, "P": 1.0, "S": 20.26, "R": -6.54, "T": -14.03, "W": 1.0, "V": 1.0, "Y": 1.0 },
    "G": { "A": -7.49, "C": 1.0, "E": -6.54, "D": 1.0, "G": 13.34, "F": 1.0, "I": -7.49, "H": 1.0, "K": -7.49, "M": 1.0, "L": 1.0, "N": -7.49, "Q": 1.0, "P": 1.0, "S": 1.0, "R": 1.0, "T": -7.49, "W": 13.34, "V": 1.0, "Y": -7.49 },
    "F": { "A": 1.0, "C": 1.0, "E": 1.0, "D": 13.34, "G": 1.0, "F": 1.0, "I": 1.0, "H": 1.0, "K": -14.03, "M": 1.0, "L": 1.0, "N": 1.0, "Q": 1.0, "P": 20.26, "S": 1.0, "R": 1.0, "T": 1.0, "W": 1.0, "V": 1.0, "Y": 33.601 },
    "I": { "A": 1.0, "C": 1.0, "E": 44.94, "D": 1.0, "G": 1.0, "F": 1.0, "I": 1.0, "H": 13.34, "K": -7.49, "M": 1.0, "L": 20.26, "N": 1.0, "Q": 1.0, "P": -1.88, "S": 1.0, "R": 1.0, "T": 1.0, "W": 1.0, "V": -7.49, "Y": 1.0 },
    "H": { "A": 1.0, "C": 1.0, "E": 1.0, "D": 1.0, "G": -9.37, "F": -9.37, "I": 44.94, "H": 1.0, "K": 24.68, "M": 1.0, "L": 1.0, "N": 24.68, "Q": 1.0, "P": -1.88, "S": 1.0, "R": 1.0, "T": -6.54, "W": -1.88, "V": 1.0, "Y": 44.94 },
    "K": { "A": 1.0, "C": 1.0, "E": 1.0, "D": 1.0, "G": -7.49, "F": 1.0, "I": -7.49, "H": 1.0, "K": 1.0, "M": 33.60, "L": -7.49, "N": 1.0, "Q": 24.64, "P": -6.54, "S": 1.0, "R": 33.60, "T": 1.0, "W": 1.0, "V": -7.49, "Y": 1.0 },
    "M": { "A": 13.34, "C": 1.0, "E": 1.0, "D": 1.0, "G": 1.0, "F": 1.0, "I": 1.0, "H": 58.28, "K": 1.0, "M": -1.88, "L": 1.0, "N": 1.0, "Q": -6.54, "P": 44.94, "S": 44.94, "R": -6.54, "T": -1.88, "W": 1.0, "V": 1.0, "Y": 24.68 },
    "L": { "A": 1.0, "C": 1.0, "E": 1.0, "D": 1.0, "G": 1.0, "F": 1.0, "I": 1.0, "H": 1.0, "K": -7.49, "M": 1.0, "L": 1.0, "N": 1.0, "Q": 33.60, "P": 20.26, "S": 1.0, "R": 20.26, "T": 1.0, "W": 24.68, "V": 1.0, "Y": 1.0 },
    "N": { "A": 1.0, "C": -1.88, "E": 1.0, "D": 1.0, "G": -14.03, "F": -14.03, "I": 44.94, "H": 1.0, "K": 24.68, "M": 1.0, "L": 1.0, "N": 1.0, "Q": -6.54, "P": -1.88, "S": 1.0, "R": 1.0, "T": -7.49, "W": -9.37, "V": 1.0, "Y": 1.0 },
    "Q": { "A": 1.0, "C": -6.54, "E": 20.26, "D": 20.26, "G": 1.0, "F": -6.54, "I": 1.0, "H": 1.0, "K": 1.0, "M": 1.0, "L": 1.0, "N": 1.0, "Q": 20.26, "P": 20.26, "S": 44.94, "R": 1.0, "T": 1.0, "W": 1.0, "V": -6.54, "Y": -6.54 },
    "P": { "A": 20.26, "C": -6.54, "E": 18.38, "D": -6.54, "G": 1.0, "F": 20.26, "I": 1.0, "H": 1.0, "K": 1.0, "M": -6.54, "L": 1.0, "N": 1.0, "Q": 20.26, "P": 20.26, "S": 20.26, "R": -6.54, "T": 1.0, "W": -1.88, "V": 20.26, "Y": 1.0 },
    "S": { "A": 1.0, "C": 33.60, "E": 20.26, "D": 1.0, "G": 1.0, "F": 1.0, "I": 1.0, "H": 1.0, "K": 1.0, "M": 1.0, "L": 1.0, "N": 1.0, "Q": 20.26, "P": 44.94, "S": 20.26, "R": 20.26, "T": 1.0, "W": 1.0, "V": 1.0, "Y": 1.0 },
    "R": { "A": 1.0, "C": 1.0, "E": 1.0, "D": 1.0, "G": -7.49, "F": 1.0, "I": 1.0, "H": 20.26, "K": 1.0, "M": 1.0, "L": 1.0, "N": 13.34, "Q": 20.26, "P": 20.26, "S": 44.94, "R": 58.28, "T": 1.0, "W": 58.28, "V": 1.0, "Y": -6.54 },
    "T": { "A": 1.0, "C": 1.0, "E": 20.26, "D": 1.0, "G": -7.49, "F": 13.34, "I": 1.0, "H": 1.0, "K": 1.0, "M": 1.0, "L": 1.0, "N": -14.03, "Q": -6.54, "P": 1.0, "S": 1.0, "R": 1.0, "T": 1.0, "W": -14.03, "V": 1.0, "Y": 1.0 },
    "W": { "A": -14.03, "C": 1.0, "E": 1.0, "D": 1.0, "G": -9.37, "F": 1.0, "I": 1.0, "H": 24.68, "K": 1.0, "M": 24.68, "L": 13.34, "N": 13.34, "Q": 1.0, "P": 1.0, "S": 1.0, "R": 1.0, "T": -14.03, "W": 1.0, "V": -7.49, "Y": 1.0 },
    "V": { "A": 1.0, "C": 1.0, "E": 1.0, "D": -14.03, "G": -7.49, "F": 1.0, "I": 1.0, "H": 1.0, "K": -1.88, "M": 1.0, "L": 1.0, "N": 1.0, "Q": 1.0, "P": 20.26, "S": 1.0, "R": 1.0, "T": -7.49, "W": 1.0, "V": 1.0, "Y": -6.54 },
    "Y": { "A": 24.68, "C": 1.0, "E": -6.54, "D": 24.68, "G": -7.49, "F": 1.0, "I": 1.0, "H": 13.34, "K": 1.0, "M": 44.94, "L": 1.0, "N": 1.0, "Q": 1.0, "P": 13.34, "S": 1.0, "R": -15.91, "T": -7.49, "W": -9.37, "V": 1.0, "Y": 13.34 }
};

// pK values for isoelectric point calculation
const positive_pKs: Record<string, number> = {
    "Nterm": 7.5, "K": 10.0, "R": 12.0, "H": 5.98
};

const negative_pKs: Record<string, number> = {
    "Cterm": 3.55, "D": 4.05, "E": 4.45, "C": 9.0, "Y": 10.0
};

const pKcterminal: Record<string, number> = { "D": 4.55, "E": 4.75 };

const pKnterminal: Record<string, number> = {
    "A": 7.59, "M": 7.0, "S": 6.93, "P": 8.36, "T": 6.82, "V": 7.44, "E": 7.7
};

const charged_aas = ["K", "R", "H", "D", "E", "C", "Y"];
const protein_letters = "ACDEFGHIKLMNPQRSTVWY";

type CountDict = Record<string, number>;

// Isoelectric point calculation class (Bjellqvist method)
class IsoelectricPoint {
    sequence: string;
    aaContent: CountDict;
    chargedAaContent: Record<string, number>;
    pos_pKs: Record<string, number>;
    neg_pKs: Record<string, number>;

    constructor(protein_sequence: string, aaContent?: CountDict) {
        this.sequence = protein_sequence.toUpperCase();
        if (!aaContent) {
            aaContent = ProteinAnalysis.count_amino_acids_static(this.sequence);
        }
        this.aaContent = aaContent;
        this.chargedAaContent = this._select_charged(aaContent);
        const { pos_pKs, neg_pKs } = this._update_pKs_tables();
        this.pos_pKs = pos_pKs;
        this.neg_pKs = neg_pKs;
    }

    _select_charged(aaContent: CountDict): Record<string, number> {
        const charged: Record<string, number> = {};
        for (const aa of charged_aas) {
            charged[aa] = Number(aaContent[aa] || 0);
        }
        charged["Nterm"] = 1.0;
        charged["Cterm"] = 1.0;
        return charged;
    }

    _update_pKs_tables() {
        const pos_pKs = { ...positive_pKs };
        const neg_pKs = { ...negative_pKs };
        const nterm = this.sequence[0];
        const cterm = this.sequence[this.sequence.length - 1];
        if (nterm in pKnterminal) {
            pos_pKs["Nterm"] = pKnterminal[nterm];
        }
        if (cterm in pKcterminal) {
            neg_pKs["Cterm"] = pKcterminal[cterm];
        }
        return { pos_pKs, neg_pKs };
    }

    charge_at_pH(pH: number): number {
        let positive_charge = 0.0;
        for (const aa in this.pos_pKs) {
            const pK = this.pos_pKs[aa];
            const partial_charge = 1.0 / (Math.pow(10, pH - pK) + 1.0);
            positive_charge += (this.chargedAaContent[aa] || 0) * partial_charge;
        }

        let negative_charge = 0.0;
        for (const aa in this.neg_pKs) {
            const pK = this.neg_pKs[aa];
            const partial_charge = 1.0 / (Math.pow(10, pK - pH) + 1.0);
            negative_charge += (this.chargedAaContent[aa] || 0) * partial_charge;
        }

        return positive_charge - negative_charge;
    }

    pi(pH: number = 7.775, min_: number = 4.05, max_: number = 12): number {
        const charge = this.charge_at_pH(pH);
        if (max_ - min_ > 0.0001) {
            if (charge > 0.0) {
                min_ = pH;
            } else {
                max_ = pH;
            }
            const next_pH = (min_ + max_) / 2;
            return this.pi(next_pH, min_, max_);
        }
        return pH;
    }
}

// Main protein analysis class (similar to Biopython's ProteinAnalysis)
class ProteinAnalysis {
    sequence: string;
    amino_acids_content: CountDict | null = null;
    length: number;
    monoisotopic: boolean;

    constructor(prot_sequence: string, monoisotopic: boolean = false) {
        this.sequence = prot_sequence.toUpperCase();
        this.length = this.sequence.length;
        this.monoisotopic = monoisotopic;
    }

    static count_amino_acids_static(seq: string): CountDict {
        const dict: CountDict = {};
        for (const aa of protein_letters) {
            dict[aa] = 0;
        }
        for (const aa of seq) {
            if (dict[aa] !== undefined) {
                dict[aa] += 1;
            }
        }
        return dict;
    }

    count_amino_acids(): CountDict {
        if (this.amino_acids_content === null) {
            const prot_dic: CountDict = {};
            for (const aa of protein_letters) {
                prot_dic[aa] = 0;
            }
            for (const aa of this.sequence) {
                if (prot_dic[aa] !== undefined) {
                    prot_dic[aa] += 1;
                }
            }
            this.amino_acids_content = prot_dic;
        }
        return this.amino_acids_content;
    }

    get amino_acids_percent(): Record<string, number> {
        const aa_counts = this.count_amino_acids();
        const percentages: Record<string, number> = {};
        for (const aa in aa_counts) {
            percentages[aa] = (aa_counts[aa] * 100) / this.length;
        }
        return percentages;
    }

    molecular_weight(circular: boolean = false): number | null {
        if (this.length === 0) return null;
        const water = this.monoisotopic ? 18.010565 : 18.0153;
        const weights = this.monoisotopic ? monoisotopic_protein_weights : protein_weights;
        let weight = 0;
        for (const aa of this.sequence) {
            weight += weights[aa] || 0;
        }
        weight -= (this.length - 1) * water;
        if (circular) {
            weight -= water;
        }
        return weight;
    }

    aromaticity(): number {
        const aromatic_aas = "YWF";
        const aa_percentages = this.amino_acids_percent;
        let aromaticity = 0;
        for (const aa of aromatic_aas) {
            aromaticity += aa_percentages[aa] / 100;
        }
        return aromaticity;
    }

    instability_index(): number {
        const index = DIWV;
        let score = 0.0;
        for (let i = 0; i < this.length - 1; i++) {
            const this_aa = this.sequence[i];
            const next_aa = this.sequence[i + 1];
            const dipeptide_value = index[this_aa]?.[next_aa] || 1.0;
            score += dipeptide_value;
        }
        return (10.0 / this.length) * score;
    }

    flexibility(): number[] {
        const flexibilities = Flex;
        const window_size = 9;
        const weights = [0.25, 0.4375, 0.625, 0.8125, 1];
        const scores: number[] = [];

        for (let i = 0; i < this.length - window_size; i++) {
            const subsequence = this.sequence.substring(i, i + window_size);
            let score = 0.0;

            for (let j = 0; j < Math.floor(window_size / 2); j++) {
                const front = subsequence[j];
                const back = subsequence[window_size - j - 1];
                score += ((flexibilities[front] || 1.0) + (flexibilities[back] || 1.0)) * weights[j];
            }

            const middle = subsequence[Math.floor(window_size / 2) + 1];
            score += flexibilities[middle] || 1.0;

            scores.push(score / 5.25);
        }

        return scores;
    }

    gravy(scale: string = "KyteDoolitle"): number {
        const selected_scale = gravy_scales[scale];
        if (!selected_scale) {
            throw new Error(`scale: ${scale} not known`);
        }
        let total_gravy = 0;
        for (const aa of this.sequence) {
            total_gravy += selected_scale[aa] || 0;
        }
        return total_gravy / this.length;
    }

    _weight_list(window: number, edge: number): number[] {
        const unit = (2 * (1.0 - edge)) / (window - 1);
        const weights: number[] = [];
        for (let i = 0; i < Math.floor(window / 2); i++) {
            weights[i] = edge + unit * i;
        }
        return weights;
    }

    protein_scale(param_dict: Record<string, number>, window: number, edge: number = 1.0): number[] {
        const weights = this._weight_list(window, edge);
        const scores: number[] = [];
        const sum_of_weights = weights.reduce((a, b) => a + b, 0) * 2 + 1;

        for (let i = 0; i <= this.length - window; i++) {
            const subsequence = this.sequence.substring(i, i + window);
            let score = 0.0;

            for (let j = 0; j < Math.floor(window / 2); j++) {
                const front = subsequence[j];
                const back = subsequence[window - j - 1];
                if (param_dict[front] !== undefined && param_dict[back] !== undefined) {
                    score += weights[j] * param_dict[front] + weights[j] * param_dict[back];
                }
            }

            const middle = subsequence[Math.floor(window / 2)];
            if (param_dict[middle] !== undefined) {
                score += param_dict[middle];
            }

            scores.push(score / sum_of_weights);
        }

        return scores;
    }

    isoelectric_point(): number {
        if (this.length === 0) return 7.0;
        const aa_content = this.count_amino_acids();
        const ie_point = new IsoelectricPoint(this.sequence, aa_content);
        return ie_point.pi();
    }

    charge_at_pH(pH: number): number {
        if (this.length === 0) return 0;
        const aa_content = this.count_amino_acids();
        const charge_calc = new IsoelectricPoint(this.sequence, aa_content);
        return charge_calc.charge_at_pH(pH);
    }

    secondary_structure_fraction(): [number, number, number] {
        const aa_percentages = this.amino_acids_percent;
        let helix = 0;
        for (const r of "EMALK") {
            helix += aa_percentages[r] / 100;
        }
        let turn = 0;
        for (const r of "NPGSD") {
            turn += aa_percentages[r] / 100;
        }
        let sheet = 0;
        for (const r of "VIYFWLT") {
            sheet += aa_percentages[r] / 100;
        }
        return [helix, turn, sheet];
    }

    molar_extinction_coefficient(): [number, number] {
        const num_aa = this.count_amino_acids();
        const mec_reduced = num_aa["W"] * 5500 + num_aa["Y"] * 1490;
        const mec_cystines = mec_reduced + Math.floor(num_aa["C"] / 2) * 125;
        return [mec_reduced, mec_cystines];
    }
}

// Backward compatibility wrapper
class ProtParam {
    protein: string;
    amino_acids: string[];

    constructor(protein: string) {
        this.protein = protein.toUpperCase();
        this.amino_acids = Array.from(this.protein);
    }

    count_amino_acids(): CountDict {
        return ProteinAnalysis.count_amino_acids_static(this.protein);
    }

    molecular_weight(circular: boolean = false, monoisotopic: boolean = false): number | null {
        const analysis = new ProteinAnalysis(this.protein, monoisotopic);
        return analysis.molecular_weight(circular);
    }

    gravy(): number | null {
        if (this.protein.length === 0) return null;
        const analysis = new ProteinAnalysis(this.protein);
        return analysis.gravy("KyteDoolitle");
    }

    net_charge(pH: number = 7.0): number {
        if (this.protein.length === 0) return 0;
        const analysis = new ProteinAnalysis(this.protein);
        return analysis.charge_at_pH(pH);
    }

    isoelectric_point(): number {
        if (this.protein.length === 0) return 7.0;
        const analysis = new ProteinAnalysis(this.protein);
        return analysis.isoelectric_point();
    }
}

// Property prediction strategies
interface PropertyPredictStrategy {
    predict(sequence: string, modelUrl: string): number;
}

// 分子量
class MwPredictStrategy implements PropertyPredictStrategy {
    predict(sequence: string, modelUrl: string): number {
        const protParam = new ProtParam(sequence);
        const mw = protParam.molecular_weight(false, false);
        return mw !== null ? Number(mw.toFixed(2)) : 0;
    }
}

// 等电点(Bjellqvist)
class PiPredictStrategy implements PropertyPredictStrategy {
    predict(sequence: string, modelUrl: string): number {
        const protParam = new ProtParam(sequence);
        const pi = protParam.isoelectric_point();
        return Number(pi.toFixed(2));
    }
}

// 疏水性
class HydPredictStrategy implements PropertyPredictStrategy {
    predict(sequence: string, modelUrl: string): number {
        const protParam = new ProtParam(sequence);
        const gravy = protParam.gravy();
        return gravy !== null ? Number(gravy.toFixed(2)) : 0;
    }
}

// 净电荷
class ChargePredictStrategy implements PropertyPredictStrategy {
    predict(sequence: string, modelUrl: string): number {
        const protParam = new ProtParam(sequence);
        const charge = protParam.net_charge(7.0);
        return Number(charge.toFixed(2));
    }
}

// 不稳定性指数
class InstabilityIndexPredictStrategy implements PropertyPredictStrategy {
    predict(sequence: string, modelUrl: string): number {
        const analysis = new ProteinAnalysis(sequence);
        const index = analysis.instability_index();
        return Number(index.toFixed(2));
    }
}

// 芳香性
class AromaticityPredictStrategy implements PropertyPredictStrategy {
    predict(sequence: string, modelUrl: string): number {
        const analysis = new ProteinAnalysis(sequence);
        const aromaticity = analysis.aromaticity();
        return Number(aromaticity.toFixed(4));
    }
}

// 灵活性（返回平均值）
class FlexibilityPredictStrategy implements PropertyPredictStrategy {
    predict(sequence: string, modelUrl: string): number {
        const analysis = new ProteinAnalysis(sequence);
        const flexScores = analysis.flexibility();
        if (flexScores.length === 0) return 0;
        const avg = flexScores.reduce((a, b) => a + b, 0) / flexScores.length;
        return Number(avg.toFixed(4));
    }
}

// 二级结构分数（返回螺旋比例）
class SecondaryStructurePredictStrategy implements PropertyPredictStrategy {
    predict(sequence: string, modelUrl: string): number {
        const analysis = new ProteinAnalysis(sequence);
        const [helix, turn, sheet] = analysis.secondary_structure_fraction();
        // 根据 modelUrl 返回不同的值：helix, turn, sheet
        if (modelUrl.includes("helix")) return Number(helix.toFixed(4));
        if (modelUrl.includes("turn")) return Number(turn.toFixed(4));
        if (modelUrl.includes("sheet")) return Number(sheet.toFixed(4));
        // 默认返回螺旋比例
        return Number(helix.toFixed(4));
    }
}

// 摩尔消光系数（返回还原形式）
class MolarExtinctionPredictStrategy implements PropertyPredictStrategy {
    predict(sequence: string, modelUrl: string): number {
        const analysis = new ProteinAnalysis(sequence);
        const [mec_reduced, mec_cystines] = analysis.molar_extinction_coefficient();
        // 根据 modelUrl 返回不同的值：reduced 或 cystines
        if (modelUrl.includes("cystines")) return Number(mec_cystines.toFixed(0));
        // 默认返回还原形式
        return Number(mec_reduced.toFixed(0));
    }
}

// 默认策略：分子量
class DefaultPredictStrategy implements PropertyPredictStrategy {
    predict(sequence: string, modelUrl: string): number {
        const protParam = new ProtParam(sequence);
        const mw = protParam.molecular_weight(false, false);
        return mw !== null ? Number(mw.toFixed(2)) : 0;
    }
}

// 工厂
class PropertyPredictFactory {
    static getStrategy(modelUrl: string): PropertyPredictStrategy {
        // 基础属性
        if (modelUrl.includes("mw") || modelUrl.includes("molecular_weight")) return new MwPredictStrategy();
        if (modelUrl.includes("pi") || modelUrl.includes("isoelectric_point")) return new PiPredictStrategy();
        if (modelUrl.includes("hyd") || modelUrl.includes("hydrophobicity")) return new HydPredictStrategy();
        if (modelUrl.includes("charge") || modelUrl.includes("net_charge")) return new ChargePredictStrategy();

        // 新增属性
        if (modelUrl.includes("instability") || modelUrl.includes("instability_index")) return new InstabilityIndexPredictStrategy();
        if (modelUrl.includes("aromaticity") || modelUrl.includes("aromatic")) return new AromaticityPredictStrategy();
        if (modelUrl.includes("flexibility") || modelUrl.includes("flex")) return new FlexibilityPredictStrategy();
        if (modelUrl.includes("secondary") || modelUrl.includes("structure")) return new SecondaryStructurePredictStrategy();
        if (modelUrl.includes("extinction") || modelUrl.includes("mec")) return new MolarExtinctionPredictStrategy();

        return new DefaultPredictStrategy();
    }
}

// 导出预测工具
export function predictProperty(sequence: string, modelUrl: string): number {
    const strategy = PropertyPredictFactory.getStrategy(modelUrl);
    return strategy.predict(sequence, modelUrl);
}

// 导出 ProteinAnalysis 类供其他模块使用
export { ProteinAnalysis, IsoelectricPoint, gravy_scales };
