import { Request, Response } from 'express';
import AdminSettingsService from '../services/adminSettingsService';
import { IAdminSettings } from '../models/adminSettingsModel';

class AdminSettingsController {
  static async getSettings(req: Request, res: Response) {
    try {
      const settings = await AdminSettingsService.getSettings();
      res.status(200).json(settings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createSettings(req: Request, res: Response) {
   try {
     const settingsData = req.body as IAdminSettings;
     const settings = await AdminSettingsService.createSettings(settingsData);
     res.status(200).json(settings);
   } catch (error: any) {
     res.status(500).json({ error: error.message });
   }
 }

 static async updateSettings(req: Request, res: Response) {
   try {
     const settingsData = req.body as IAdminSettings;
     const settings = await AdminSettingsService.updateSettings(settingsData);
     res.status(200).json(settings);
   } catch (error: any) {
     res.status(500).json({ error: error.message });
   }
 }

  static async deleteSettings(req: Request, res: Response) {
    try {
      await AdminSettingsService.deleteSettings();
      res.status(200).json({ message: 'Settings deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default AdminSettingsController;
