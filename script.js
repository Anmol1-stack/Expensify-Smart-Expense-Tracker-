
// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard
    renderBalanceCard();
    renderSpendingChart();
    renderSavingsData();
    renderInvestmentsChart();
    renderTransactions();
    renderDailyLimit();
    
    // Set up event listeners
    setupEventListeners();
  });
  
  // Render the balance card with data
  function renderBalanceCard() {
    const { totalBalance, onlineBalance, cash, spentAmount, spentPercentage } = dashboardData.balanceInfo;
    
    // Update balance
    document.querySelector('.balance-amount').textContent = totalBalance;
    
    // Update online balance
    document.querySelectorAll('.balance-item .amount')[0].textContent = onlineBalance.toLocaleString();
    
    // Update cash balance
    document.querySelectorAll('.balance-item .amount')[1].textContent = cash.toLocaleString();
    
    // Update spent info
    document.querySelector('.spent-amount').textContent = `${spentAmount} Spent`;
    document.querySelector('.spent-percentage').textContent = `${spentPercentage}%`;
  }
  
  // Render the spending chart
  function renderSpendingChart() {
    const ctx = document.getElementById('spending-chart-container');
    
    // Create chart using ApexCharts
    const options = {
      series: [{
        name: "Spending",
        data: dashboardData.spendingChartData.map(item => item.value)
      }],
      chart: {
        height: 200,
        type: 'area',
        toolbar: {
          show: false
        },
        sparkline: {
          enabled: false
        },
        animations: {
          enabled: true,
        },
        background: 'transparent'
      },
      colors: ['#4169e1'],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'vertical',
          shadeIntensity: 0.5,
          gradientToColors: ['rgba(65, 105, 225, 0)'],
          inverseColors: false,
          opacityFrom: 0.8,
          opacityTo: 0.1,
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      grid: {
        show: false,
      },
      xaxis: {
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        show: false,
      },
      tooltip: {
        theme: 'dark',
        x: {
          show: false
        }
      },
    };
    
    const chart = new ApexCharts(ctx, options);
    chart.render();
  }
  
  // Render the savings data
  function renderSavingsData() {
    // Progress rings are already rendered in HTML
    // We just need to set the data attributes for the circles to use with CSS
    const progressRings = document.querySelectorAll('.progress-ring-circle');
    
    // Match the data to each savings item
    dashboardData.savingsData.forEach((data, index) => {
      progressRings[index].style.setProperty('--percentage', data.percentage);
      progressRings[index].style.setProperty('--color', data.color);
    });
  }
  
  // Render the investments donut chart
  function renderInvestmentsChart() {
    const ctx = document.getElementById('investments-chart');
    
    const options = {
      series: dashboardData.investmentsData.map(item => item.value),
      chart: {
        type: 'donut',
        height: 120,
        width: 120
      },
      colors: dashboardData.investmentsData.map(item => item.color),
      labels: dashboardData.investmentsData.map(item => item.name),
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      stroke: {
        width: 2,
        colors: ['transparent']
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
          }
        }
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: function(value) {
            return value + '%';
          }
        }
      }
    };
    
    const chart = new ApexCharts(ctx, options);
    chart.render();
  }
  
  // Render transactions
  function renderTransactions() {
    const transactionsList = document.getElementById('transactions-list');
    transactionsList.innerHTML = '';
    
    dashboardData.transactions.forEach(transaction => {
      const transactionEl = document.createElement('div');
      transactionEl.className = 'transaction-item';
      
      const sign = transaction.isPositive ? '+' : '-';
      const amountClass = transaction.isPositive ? 'transaction-amount positive' : 'transaction-amount';
      
      transactionEl.innerHTML = `
        <div class="transaction-info">
          <div class="transaction-icon">
            <span>${transaction.icon}</span>
          </div>
          <div class="transaction-details">
            <div class="transaction-title">${transaction.title}</div>
            <div class="transaction-date">${transaction.date}, ${transaction.time}</div>
          </div>
        </div>
        <div class="${amountClass}">${sign}${transaction.amount}</div>
      `;
      
      transactionsList.appendChild(transactionEl);
    });
  }
  
  // Render daily limit
  function renderDailyLimit() {
    const { spent, limit, percentage } = dashboardData.dailyLimit;
    
    // Update progress bar
    const progressFill = document.getElementById('daily-limit-progress');
    progressFill.style.width = `${percentage}%`;
    
    // Update text
    document.querySelector('.progress-text').textContent = `${spent} spent of ${limit}`;
    document.querySelector('.progress-percentage').textContent = `${percentage}%`;
  }
  
  // Set up event listeners
  function setupEventListeners() {
    // Sidebar icons
    document.querySelectorAll('.sidebar-icon').forEach((icon, index) => {
      icon.addEventListener('click', () => {
        // Remove active class from all icons
        document.querySelectorAll('.sidebar-icon').forEach(i => {
          i.classList.remove('active');
        });
        
        // Add active class to clicked icon
        icon.classList.add('active');
        
        // Show toast notification
        let title, message;
        
        switch(index) {
          case 0: 
            title = "Dashboard";
            message = "Welcome to your dashboard";
            break;
          case 1:
            title = "Cards";
            message = "Manage your payment cards";
            break;
          case 2:
            title = "Analytics";
            message = "View your financial analytics";
            break;
          case 3:
            title = "Investments";
            message = "Manage your investment portfolio";
            break;
          case 4:
            title = "Messages";
            message = "You have 3 unread messages";
            break;
          case 5:
            title = "Settings";
            message = "Adjust your account settings";
            break;
          case 6:
            title = "Logout";
            message = "Are you sure you want to log out?";
            break;
          default:
            title = "Navigation";
            message = "Selected a new section";
        }
        
        showToast(title, message);
      });
    });
    
    // Chart tabs
    document.querySelectorAll('.chart-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.chart-tab').forEach(t => {
          t.classList.remove('active');
        });
        tab.classList.add('active');
        showToast("Chart View", `Changed to ${tab.textContent} view`);
      });
    });
    
    // Add transaction button
    document.querySelector('.add-button').addEventListener('click', () => {
      showToast("New Transaction", "Add a new transaction to your account");
    });
    
    // Notification bell
    document.querySelector('.notification-icon').addEventListener('click', () => {
      showToast("Notifications", "You have 3 new notifications");
    });
    
    // Search icon
    document.querySelector('.search-icon').addEventListener('click', () => {
      showToast("Search", "Search for transactions and activities");
    });
    
    // Date selector
    document.querySelector('.date-selector').addEventListener('click', () => {
      showToast("Date Range", "Select a different date range to view");
    });
    
    // Toast close button
    document.getElementById('toast-close').addEventListener('click', () => {
      hideToast();
    });
  }
  
  // Show toast notification
  function showToast(title, message) {
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toast-title');
    const toastMessage = document.getElementById('toast-message');
    
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    toast.classList.add('show');
    
    // Auto hide after 5 seconds
    setTimeout(hideToast, 5000);
  }
  
  // Hide toast notification
  function hideToast() {
    const toast = document.getElementById('toast');
    toast.classList.remove('show');
  }