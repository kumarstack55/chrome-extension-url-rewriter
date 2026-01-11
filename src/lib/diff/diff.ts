enum EditScriptType {
  estAdd = "Add",
  estDelete = "Delete",
  estCopy = "Copy",
}

class EditScriptRecord {
  public type: EditScriptType;
  private characterList: string[];
  constructor(type: EditScriptType, character: string) {
    this.type = type;
    this.characterList = [character];
  }
  addCharacter(character: string) {
    this.characterList.push(character);
  }
  getString(): string {
    return this.characterList.join("");
  }
}

class EditScriptRecordSet {
  private records: EditScriptRecord[];

  constructor() {
    this.records = [];
  }

  addCharacter(type: EditScriptType, character: string) {
    if (
      this.records.length > 0 &&
      this.records[this.records.length - 1].type === type
    ) {
      const lastRecord = this.records[this.records.length - 1];
      lastRecord.addCharacter(character);
      return;
    }

    const newRecord = new EditScriptRecord(type, character);
    this.records.push(newRecord);
  }

  get length(): number {
    return this.records.length;
  }

  map<T>(callback: (record: EditScriptRecord) => T): T[] {
    return this.records.map(callback);
  }
}

class DifferenceResult {
  constructor(
    public ld: number,
    public lcs: string[],
    public ses: EditScriptRecordSet
  ) {
    this.ld = ld;
    this.lcs = lcs;
    this.ses = ses;
  }
}

export function diff(x: string, y: string): DifferenceResult {
  const xLength = x.length;
  const yLength = y.length;

  const dp: number[][] = Array.from({ length: yLength + 1 }, () =>
    Array(xLength + 1)
  );

  for (let i = 0; i <= yLength; i++) {
    dp[i][0] = 0;
  }
  for (let j = 0; j <= xLength; j++) {
    dp[0][j] = 0;
  }

  for (let i = 1; i <= yLength; i++) {
    for (let j = 1; j <= xLength; j++) {
      const base = Math.max(dp[i - 1][j], dp[i][j - 1]);
      const yChar = y[i - 1];
      const xChar = x[j - 1];
      dp[i][j] = base + (xChar === yChar ? 1 : 0);
    }
  }

  // dpテーブルの内容をコンソールに出力する。
  for (let i = 0; i <= yLength; i++) {
    console.log(`${i}: ` + dp[i].join(" "));
  }

  const lcs: string[] = [];
  const ses: EditScriptRecordSet = new EditScriptRecordSet();

  let i = yLength;
  let j = xLength;
  while (i != 0 || j != 0) {
    const yChar = y[i - 1];
    const xChar = x[j - 1];
    if (xChar === yChar) {
      i--;
      j--;
      ses.addCharacter(EditScriptType.estCopy, xChar);
      lcs.unshift(xChar);
    } else {
      if (dp[i - 1][j] > dp[i][j - 1]) {
        j--;
        ses.addCharacter(EditScriptType.estAdd, yChar);
      } else if (dp[i - 1][j] < dp[i][j - 1]) {
        i--;
        ses.addCharacter(EditScriptType.estDelete, xChar);
      } else {
        if (j > 0) {
          j--;
          ses.addCharacter(EditScriptType.estDelete, xChar);
        } else if (i > 0) {
          i--;
          ses.addCharacter(EditScriptType.estAdd, yChar);
        }
      }
    }
  }

  const ld = ses.length - lcs.length;

  console.log(ld);
  console.log(lcs);
  console.log(
    ses.map((record) => `${record.type}('${record.getString()}')`).join(", ")
  );

  return new DifferenceResult(ld, lcs, ses);
}
