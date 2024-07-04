import { Referral } from "../models/referralModel";
import { Users } from "../models/userModel";

class ReferralService {
  static async rewardReferral(referralId: string) {
    const referral = await Referral.findById(referralId);
    if (!referral) throw new Error("Referral not found");

    const referrer = await Users.findById(referral.referrer);
    const referee = await Users.findById(referral.referee);
    if (!referrer || !referee) throw new Error("User not found");

    // Define your reward logic here
    // get reward amount from admin settings
    const rewardAmount = 100; // TODO: Set initial reward, can be updated later..... you can add it to admin settings so that you can set the reward value

    // Update referrer wallet
    const referrerWallet = await Referral.findById(referrer.referral);
    if (referrerWallet) {
      referrerWallet.referralBonus += rewardAmount;
      await referrerWallet.save();
    }

    // Update referral status
    referral.reward = rewardAmount;
    referral.status = "completed";
    await referral.save();

    return { referrer, rewardAmount };
  }
}

export default ReferralService;