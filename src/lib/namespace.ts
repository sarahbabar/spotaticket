class SimpleNameSpace {
    static URL = 'https://silly-store.ncp.nathanferns.xyz'

    public name: string;
    public write_key: string | null = null;
    public stringify: boolean = true;

    constructor(name: string, write_key: string | null = null, stringify: boolean = true) {
        this.name = name;
        this.write_key = write_key
        this.stringify = stringify
    }

    private stringifix(value: any): string {
        if (this.stringify) {
            return JSON.stringify(value)
        }

        if (typeof value !== 'string') {
            return value.toString()
        }

        return value
    }

    public async get(store: string): Promise<any | null> {
        const response = await fetch(`${SimpleNameSpace.URL}/read/${this.name}/${store}`);

        if (response.status === 200) {
            const text = await response.text();
            return this.stringify ? JSON.parse(text) : text;
        }

        return null;
    }

    public async set(store: string, value: any): Promise<void> {
        const response = await fetch(`${SimpleNameSpace.URL}/write/${this.name}/${this.write_key}/${store}`, {
            method: 'POST',
            body: this.stringifix(value)
        });

        if (response.status !== 200) {
            throw new Error('Failed to write to store');
        }
    }
}


// return two methods [get, set] that can be used to interact with the namespace
export function Namespace(name: string, write_key: string | null = null, stringify: boolean = true): [get: (store: string) => Promise<any | null>, set: (store: string, value: any) => Promise<void>] {
    const ns = new SimpleNameSpace(name, write_key, stringify);
    return [ns.get.bind(ns), ns.set.bind(ns)];
}