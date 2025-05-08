
// This file contains our mock data (simulated backend)
const dashboardData = {
  balanceInfo: {
    totalBalance: 15000,
    onlineBalance: 11000,
    cash: 4000,
    spentAmount: 300,
    spentPercentage: 2
  },
  
  spendingChartData: [
    { name: "wk1", value: 2000 },
    { name: "wk2", value: 3000 },
    { name: "wk3", value: 5000 },
    { name: "wk4", value: 2500 }
  ],
  
  savingsData: [
    { 
      month: "January", 
      percentage: 46, 
      savedAmount: 360, 
      goalAmount: 1000,
      color: "#4169e1" // Blue for medium progress
    },
    { 
      month: "February", 
      percentage: 100, 
      savedAmount: 1500, 
      goalAmount: 1500,
      color: "#fde047" // Yellow for completed
    },
    { 
      month: "March", 
      percentage: 7, 
      savedAmount: 100, 
      goalAmount: 3000,
      color: "#ff6b35" // Orange for low progress
    }
  ],
  
  investmentsData: [
    { name: "Invested", value: 60, color: "#fde047" },
    { name: "Profit", value: 25, color: "#1e3a29" },
    { name: "Loss", value: 15, color: "#ff6b35" }
  ],
  
  transactions: [
    { 
      id: 1, 
      title: "Coffee shop", 
      date: "12 May", 
      time: "5:40pm", 
      amount: "₹50/-", 
      isPositive: false,
      icon: "☕" 
    },
    { 
      id: 2, 
      title: "Refund for the order", 
      date: "11 May", 
      time: "2:10pm", 
      amount: "₹340.80/-", 
      isPositive: true,
      icon: "💰" 
    },
    { 
      id: 3, 
      title: "Rent payment", 
      date: "11 May", 
      time: "06:00am", 
      amount: "₹7000/-", 
      isPositive: false,
      icon: "🏠" 
    },
    { 
      id: 4, 
      title: "Coffee shop", 
      date: "12 May", 
      time: "5:40pm", 
      amount: "₹50/-", 
      isPositive: false,
      icon: "☕" 
    },
    { 
      id: 5, 
      title: "Refund for the order", 
      date: "11 May", 
      time: "2:10pm", 
      amount: "₹340.80/-", 
      isPositive: true,
      icon: "💰" 
    },
    { 
      id: 6, 
      title: "Rent payment", 
      date: "11 May", 
      time: "06:00am", 
      amount: "₹7000/-", 
      isPositive: false,
      icon: "🏠" 
    },
    { 
      id: 7, 
      title: "Grocery store", 
      date: "11 May", 
      time: "1:55pm", 
      amount: "₹1000/-", 
      isPositive: false,
      icon: "🛒" 
    }
  ],
  
  dailyLimit: {
    spent: 400,
    limit: 500,
    percentage: 80
  }
};
