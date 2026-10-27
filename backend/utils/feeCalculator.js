import FineRule from '../models/FineRule.js';
import mockStore from '../config/mockStore.js';

export async function getCalculatedFees(rawFees) {
  let fineRules = [];
  if (mockStore.isMock) {
    fineRules = await mockStore.find('fineRules');
  } else {
    fineRules = await FineRule.find();
  }

  return rawFees.map(feeObj => {
    const fee = feeObj.toObject ? feeObj.toObject() : { ...feeObj };
    
    // For already paid fees, use the persisted fine value
    if (fee.status === 'paid') {
      fee.fine = fee.fine || 0;
      fee.totalAmount = fee.amount + fee.fine;
      return fee;
    }

    if (!fee.dueDate) {
      fee.fine = 0;
      fee.totalAmount = fee.amount;
      return fee;
    }

    const dueDate = new Date(fee.dueDate);
    const now = new Date();
    if (now <= dueDate) {
      fee.fine = 0;
      fee.totalAmount = fee.amount;
      return fee;
    }

    // Past due date
    fee.status = 'overdue';

    const diffTime = Math.abs(now - dueDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    let fineAmount = 0;
    if (diffDays > 0) {
      for (const rule of fineRules) {
        if (diffDays >= rule.minDays && diffDays <= rule.maxDays) {
          fineAmount = rule.fineAmount;
          break;
        }
      }
      if (fineAmount === 0 && fineRules.length > 0) {
        const sortedRules = [...fineRules].sort((a, b) => b.maxDays - a.maxDays);
        if (diffDays > sortedRules[0].maxDays) {
          fineAmount = sortedRules[0].fineAmount;
        }
      }
    }

    fee.fine = fineAmount;
    fee.totalAmount = fee.amount + fineAmount;
    return fee;
  });
}
