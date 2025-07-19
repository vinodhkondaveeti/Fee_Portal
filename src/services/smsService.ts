
// SMS Service for sending fee deadline notifications
export interface SMSNotification {
  studentId: string;
  mobile: string;
  message: string;
  scheduledTime: Date;
}

class SMSService {
  private notifications: SMSNotification[] = [];

  // In a real application, this would integrate with an SMS API like Twilio
  sendSMS(mobile: string, message: string): Promise<boolean> {
    return new Promise((resolve) => {
      // Simulate SMS sending
      console.log(`SMS sent to ${mobile}: ${message}`);
      
      // Show notification in browser for demo purposes
      if ('Notification' in window) {
        new Notification('SMS Sent', {
          body: `Message sent to ${mobile}: ${message}`,
          icon: '/favicon.ico'
        });
      }
      
      setTimeout(() => resolve(true), 1000);
    });
  }

  scheduleNotification(studentId: string, mobile: string, message: string, scheduledTime: Date) {
    const notification: SMSNotification = {
      studentId,
      mobile,
      message,
      scheduledTime
    };
    
    this.notifications.push(notification);
    
    // Schedule the notification
    const timeUntilSend = scheduledTime.getTime() - Date.now();
    if (timeUntilSend > 0) {
      setTimeout(() => {
        this.sendSMS(mobile, message);
        this.notifications = this.notifications.filter(n => n !== notification);
      }, timeUntilSend);
    }
  }

  getScheduledNotifications(): SMSNotification[] {
    return [...this.notifications];
  }

  cancelNotification(studentId: string) {
    this.notifications = this.notifications.filter(n => n.studentId !== studentId);
  }
}

export const smsService = new SMSService();

// Request notification permission on app load
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}
