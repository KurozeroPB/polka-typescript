import Collection from "@kurozero/collection";
import path from "path";
import polka, { Polka } from "polka";
import { promises as fs } from "fs";
import { IRoute } from "../interfaces/IRoute";

export default class APIRouter {
    public router: Polka;
    public routes: Collection<IRoute>;
    public path: string;

    public constructor() {
        this.router = polka();
        this.routes = new Collection();
        this.path = "/api";
    }

    public async loadRoutes(): Promise<void> {
        const files = await fs.readdir(path.join(__dirname, "routes"));
        for (const file of files) {
            if (file.endsWith(".ts")) {
                const route: IRoute = new (await import(path.join(__dirname, "routes", file))).default(this);
                this.routes.add(route);
                console.info(`Connected route: ${this.path}${route.path}`);
            }
        }
    }
}
