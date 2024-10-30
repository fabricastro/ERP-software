import { BaseService } from "./BaseService";

class DashboardService extends BaseService {
    constructor() {
        super(import.meta.env.VITE_API_URL);
    }
    async getDashboardData() {
        return this.api.get("/dashboard");
    }
}

export const dashboardService = new DashboardService();
