
import { supabase } from '@/integrations/supabase/client';

interface SMSNotification {
  studentId: string;
  studentName: string;
  mobile: string;
  feeType: string;
  amount: number;
  deadline: string;
}

export class SMSNotificationService {
  private static instance: SMSNotificationService;
  
  static getInstance(): SMSNotificationService {
    if (!SMSNotificationService.instance) {
      SMSNotificationService.instance = new SMSNotificationService();
    }
    return SMSNotificationService.instance;
  }

  async sendFeeDeadlineAlert(notification: SMSNotification): Promise<boolean> {
    try {
      const message = this.formatSMSMessage(notification);
      
      // In a real application, you would integrate with an SMS service like Twilio, AWS SNS, etc.
      // For demo purposes, we'll log the SMS and show a toast notification
      console.log(`SMS Alert sent to ${notification.mobile}:`, message);
      
      // Store the SMS log in database for tracking
      await this.logSMSNotification(notification, message);
      
      // Simulate SMS sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error('Failed to send SMS:', error);
      return false;
    }
  }

  private formatSMSMessage(notification: SMSNotification): string {
    return `🎓 FEE ALERT 🎓
Student: ${notification.studentName}
ID: ${notification.studentId}

📋 Fee Type: ${notification.feeType}
💰 Amount Due: ₹${notification.amount.toLocaleString()}
📅 Deadline: ${notification.deadline}

⚠️ Please pay your fees before the deadline to avoid late penalties.

Portal: Fee Portal Nexus
Thank you!`;
  }

  private async logSMSNotification(notification: SMSNotification, message: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          student_id: notification.studentId,
          description: `SMS Alert: ${notification.feeType} Fee Deadline`,
          amount: 0, // SMS notifications don't have monetary amount
          transaction_type: 'sms_notification'
        });

      if (error) {
        console.error('Failed to log SMS notification:', error);
      }
    } catch (error) {
      console.error('Error logging SMS notification:', error);
    }
  }

  async checkAndSendDeadlineAlerts(): Promise<void> {
    try {
      // Get all students with pending dues
      const { data: studentFees, error } = await supabase
        .from('student_fees')
        .select(`
          *,
          students (
            student_id,
            name,
            mobile
          )
        `)
        .gt('due_amount', 0);

      if (error) {
        console.error('Error fetching student fees:', error);
        return;
      }

      const today = new Date();
      const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);

      for (const fee of studentFees || []) {
        // Simulate deadline checking - in real app, this would come from fee_deadlines table
        const shouldSendAlert = Math.random() > 0.7; // 30% chance to simulate deadline proximity
        
        if (shouldSendAlert && fee.students) {
          const notification: SMSNotification = {
            studentId: fee.students.student_id,
            studentName: fee.students.name,
            mobile: fee.students.mobile,
            feeType: fee.fee_name,
            amount: fee.due_amount,
            deadline: threeDaysFromNow.toLocaleDateString('en-IN')
          };

          await this.sendFeeDeadlineAlert(notification);
          
          // Add small delay between SMS sends to avoid overwhelming the service
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    } catch (error) {
      console.error('Error in deadline alerts check:', error);
    }
  }

  async scheduleDeadlineChecks(): Promise<void> {
    // Check for deadlines every hour
    setInterval(async () => {
      await this.checkAndSendDeadlineAlerts();
    }, 60 * 60 * 1000); // 1 hour

    // Initial check
    await this.checkAndSendDeadlineAlerts();
  }
}

export const smsService = SMSNotificationService.getInstance();
