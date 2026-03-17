export class MemoryStorage {
  private memory = new Map<string, string>();

  async setItem(key: string, value: string): Promise<void> {
    this.memory.set(key, value);
  }

  async getItem(key: string): Promise<string | null> {
    return this.memory.get(key) ?? null;
  }

  async removeItem(key: string): Promise<void> {
    this.memory.delete(key);
  }
}

export const storage = new MemoryStorage();
