import fs from 'fs';
import { injectable } from 'inversify';

export interface IUtils {
  parse(filePath: string): Promise<string[]>;
}

@injectable()
export class Utils implements IUtils {
  async parse(file: string): Promise<string[]> {
    return new Promise(res => fs.readFile(file, {}, (_, data) => res(data.toString().split('\r\n'))));
  }
}
