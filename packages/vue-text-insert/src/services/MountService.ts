import type { App } from "vue";

class MountService {
    private appInstance?: App = undefined;

    public setAppInstance(appInstance: App) {
        if (this.appInstance) return;

        this.appInstance = appInstance;
    }

    public getAppInstance(): App {
        return this.appInstance!;
    }
}

export default new MountService();
