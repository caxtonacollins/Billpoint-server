import AdminSettings, { IAdminSettings } from '../models/adminSettingsModel';

class AdminSettingsService {
  async getSettings(): Promise<IAdminSettings | null> {
    try {
      const settings = await AdminSettings.findOne();
      return settings;
    } catch (error: any) {
      throw new Error(`Error fetching settings: ${error.message}`);
    }
  }

  async createSettings(settingsData: IAdminSettings): Promise<IAdminSettings> {
   try {
     const settings = new AdminSettings(settingsData);
     await settings.save();
     return settings;
   } catch (error: any) {
     throw new Error(`Error creating settings: ${error.message}`);
   }
 }

 async updateSettings(settingsData: IAdminSettings): Promise<IAdminSettings | null> {
   try {
     const settings = await AdminSettings.findOneAndUpdate({}, settingsData, { new: true });
     return settings;
   } catch (error: any) {
     throw new Error(`Error updating settings: ${error.message}`);
   }
 }

  async deleteSettings(): Promise<void> {
    try {
      await AdminSettings.deleteMany({});
    } catch (error: any) {
      throw new Error(`Error deleting settings: ${error.message}`);
    }
  }
}

export default new AdminSettingsService();
