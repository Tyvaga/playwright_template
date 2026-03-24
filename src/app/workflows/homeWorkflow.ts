import { NavigationService } from "../services/navigationService";

export class HomeWorkflow {
  constructor(private readonly navigation: NavigationService) {}

  async visitHome() {
    await this.navigation.goToHome();
    await this.navigation.clickBannerAndWait();
  }
}
