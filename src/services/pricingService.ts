import AdminSettings from "../models/adminSettingsModel";
import { Users } from "../models/userModel";

interface PricingResult {
  finalAmount: number;
  chargeValue: number;
}

class PricingService {
  static async calculatePrice(
    userId: string,
    productType: string,
    productAmount: number
  ): Promise<PricingResult> {
    try {
      const user = await Users.findById(userId);
      if (!user) throw new Error("User not found");

      const settings = await AdminSettings.findOne({});
      if (!settings) throw new Error("Admin settings not found");

      let finalAmount = productAmount;
      let chargeValue = 0;

      const applyDiscountOrCharge = (
        type: string,
        value: number,
        amount: number
      ): number => {
        if (type === "percentage") {
          const charge = amount * (value / 100);
          chargeValue += charge; // Accumulate charge value
          return charge;
        }
        return value;
      };

      if (user.role === "agent") {
        const agentDiscount = applyDiscountOrCharge(
          settings.agentDiscount.type,
          settings.agentDiscount.value,
          productAmount
        );
        finalAmount -= agentDiscount;
        chargeValue += agentDiscount; // Accumulate charge value
      } else {
        switch (productType) {
          case "data":
            finalAmount += settings.dataCharge;
            chargeValue += settings.dataCharge; // Accumulate charge value
            break;
          case "airtime":
            const airtimeDiscount = applyDiscountOrCharge(
              settings.airtimeDiscount.type,
              settings.airtimeDiscount.value,
              productAmount
            );
            finalAmount -= airtimeDiscount;
            chargeValue += airtimeDiscount; // Accumulate charge value
            break;
          case "electricity":
            const electricityCharge = applyDiscountOrCharge(
              settings.electricityCharge.type,
              settings.electricityCharge.value,
              productAmount
            );
            finalAmount += electricityCharge;
            chargeValue += electricityCharge; // Accumulate charge value
            break;
          case "withdrawal":
            const withdrawalCharge = applyDiscountOrCharge(
              settings.withdrawalCharge.type,
              settings.withdrawalCharge.value,
              productAmount
            );
            finalAmount += withdrawalCharge;
            chargeValue += withdrawalCharge; // Accumulate charge value
            break;
          case "education":
            const educationCharge = applyDiscountOrCharge(
              settings.educationPinCharge.type,
              settings.educationPinCharge.value,
              productAmount
            );
            finalAmount += educationCharge;
            chargeValue += educationCharge; // Accumulate charge value
            break;
          case "transfer":
            const transferCharge = applyDiscountOrCharge(
              settings.transferCharge.type,
              settings.transferCharge.value,
              productAmount
            );
            finalAmount += transferCharge;
            chargeValue += transferCharge; // Accumulate charge value
            break;
          default:
            throw new Error("Invalid product type");
        }
      }

      return { finalAmount, chargeValue };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default PricingService;
