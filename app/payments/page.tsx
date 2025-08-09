'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { Chatbot } from '@/components/chatbot'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DollarSign, CreditCard, Calendar, TrendingUp, Download, Wallet, ArrowUpRight, ArrowDownLeft, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { apiClient } from '@/lib/api'

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [withdrawalAmount, setWithdrawalAmount] = useState('')
  const [withdrawalMethod, setWithdrawalMethod] = useState('')

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const response = await apiClient.getPayments()
      if (response.data) {
        setPayments(response.data.results || [])
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  // Mock payment data
  const mockPayments = [
    {
      id: 1,
      type: 'earning',
      description: 'Feedback reward - Yaya Centre Extension',
      amount: 500,
      status: 'completed',
      date: '2024-01-18',
      project_name: 'Yaya Centre Extension',
      feedback_type: 'Structured Feedback'
    },
    {
      id: 2,
      type: 'earning',
      description: 'Feedback reward - Green Residences',
      amount: 750,
      status: 'completed',
      date: '2024-01-12',
      project_name: 'Green Residences',
      feedback_type: 'General Feedback'
    },
    {
      id: 3,
      type: 'withdrawal',
      description: 'Bank transfer to KCB Account',
      amount: -1000,
      status: 'completed',
      date: '2024-01-10',
      withdrawal_method: 'Bank Transfer'
    },
    {
      id: 4,
      type: 'earning',
      description: 'Feedback reward - Tech Hub Kilimani',
      amount: 600,
      status: 'completed',
      date: '2024-01-07',
      project_name: 'Tech Hub Kilimani',
      feedback_type: 'Structured Feedback'
    },
    {
      id: 5,
      type: 'withdrawal',
      description: 'M-Pesa withdrawal',
      amount: -500,
      status: 'pending',
      date: '2024-01-05',
      withdrawal_method: 'M-Pesa'
    },
    {
      id: 6,
      type: 'earning',
      description: 'Bonus for quality feedback',
      amount: 200,
      status: 'completed',
      date: '2024-01-03',
      project_name: 'Multiple Projects',
      feedback_type: 'Quality Bonus'
    }
  ]

  const totalEarnings = mockPayments
    .filter(p => p.type === 'earning' && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)

  const totalWithdrawals = Math.abs(mockPayments
    .filter(p => p.type === 'withdrawal' && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0))

  const availableBalance = totalEarnings - totalWithdrawals

  const pendingPayments = mockPayments.filter(p => p.status === 'pending').length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'failed': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle
      case 'pending': return Clock
      case 'failed': return AlertCircle
      default: return Clock
    }
  }

  const handleWithdrawal = async () => {
    if (!withdrawalAmount || !withdrawalMethod) return
    
    // Mock withdrawal request
    console.log('Withdrawal request:', { amount: withdrawalAmount, method: withdrawalMethod })
    setWithdrawalAmount('')
    setWithdrawalMethod('')
  }

  if (loading) {
    return (
      <div className="flex">
        <Navigation userType="resident" />
        <div className="flex-1">
          <div className="p-6 pt-20 lg:pt-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="grid gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation userType="resident" />
      
      <div className="flex-1">
        <div className="p-6 pt-20 lg:pt-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">   </h1>
              <h1 className="text-3xl font-bold">   </h1>
              <h1 className="text-3xl font-bold flex items-center space-x-3">
                <DollarSign className="w-8 h-8 text-primary" />
                <span>Payments & Earnings</span>
              </h1>
              <p className="text-muted-foreground">
                Track your feedback rewards and manage withdrawals
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Download className="w-4 h-4 mr-2" />
              Export Statement
            </Button>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 to-primary/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                <Wallet className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">KSh {availableBalance.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Ready for withdrawal
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">KSh {totalEarnings.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  From feedback rewards
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
                <ArrowDownLeft className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">KSh {totalWithdrawals.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Successfully withdrawn
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{pendingPayments}</div>
                <p className="text-xs text-muted-foreground">
                  Transactions processing
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="transactions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="transactions">Transaction History</TabsTrigger>
              <TabsTrigger value="withdraw">Withdraw Funds</TabsTrigger>
              <TabsTrigger value="analytics">Earnings Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    Your payment history and feedback rewards
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockPayments.map((payment) => {
                      const StatusIcon = getStatusIcon(payment.status)
                      const isEarning = payment.type === 'earning'
                      
                      return (
                        <div key={payment.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isEarning ? 'bg-green-100' : 'bg-blue-100'
                            }`}>
                              {isEarning ? (
                                <ArrowUpRight className="w-5 h-5 text-green-600" />
                              ) : (
                                <ArrowDownLeft className="w-5 h-5 text-blue-600" />
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <div className="font-medium">{payment.description}</div>
                              <div className="text-sm text-muted-foreground flex items-center space-x-4">
                                <span>{new Date(payment.date).toLocaleDateString()}</span>
                                {payment.project_name && (
                                  <span>• {payment.project_name}</span>
                                )}
                                {payment.feedback_type && (
                                  <Badge variant="outline" className="text-xs">
                                    {payment.feedback_type}
                                  </Badge>
                                )}
                                {payment.withdrawal_method && (
                                  <Badge variant="outline" className="text-xs">
                                    {payment.withdrawal_method}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className={`text-lg font-bold ${
                              isEarning ? 'text-green-600' : 'text-blue-600'
                            }`}>
                              {isEarning ? '+' : ''}KSh {Math.abs(payment.amount).toLocaleString()}
                            </div>
                            <Badge className={getStatusColor(payment.status)}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {payment.status}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="withdraw" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Withdraw Funds</CardTitle>
                    <CardDescription>
                      Transfer your earnings to your preferred payment method
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Available Balance</span>
                        <span className="text-lg font-bold text-primary">
                          KSh {availableBalance.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Withdrawal Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount"
                        value={withdrawalAmount}
                        onChange={(e) => setWithdrawalAmount(e.target.value)}
                        max={availableBalance}
                      />
                      <div className="text-xs text-muted-foreground">
                        Minimum withdrawal: KSh 100 • Maximum: KSh {availableBalance.toLocaleString()}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="method">Withdrawal Method</Label>
                      <Select value={withdrawalMethod} onValueChange={setWithdrawalMethod}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mpesa">M-Pesa</SelectItem>
                          <SelectItem value="bank">Bank Transfer</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {withdrawalMethod === 'mpesa' && (
                      <div className="space-y-2">
                        <Label htmlFor="mpesa">M-Pesa Number</Label>
                        <Input
                          id="mpesa"
                          placeholder="254700000000"
                        />
                      </div>
                    )}

                    {withdrawalMethod === 'bank' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="bank">Bank Name</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select bank" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kcb">KCB Bank</SelectItem>
                              <SelectItem value="equity">Equity Bank</SelectItem>
                              <SelectItem value="coop">Co-operative Bank</SelectItem>
                              <SelectItem value="absa">Absa Bank</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="account">Account Number</Label>
                          <Input
                            id="account"
                            placeholder="Enter account number"
                          />
                        </div>
                      </div>
                    )}

                    {withdrawalMethod === 'paypal' && (
                      <div className="space-y-2">
                        <Label htmlFor="paypal">PayPal Email</Label>
                        <Input
                          id="paypal"
                          type="email"
                          placeholder="your@email.com"
                        />
                      </div>
                    )}

                    <Button 
                      onClick={handleWithdrawal}
                      disabled={!withdrawalAmount || !withdrawalMethod || parseFloat(withdrawalAmount) < 100}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Request Withdrawal
                    </Button>

                    <div className="text-xs text-muted-foreground">
                      Processing time: M-Pesa (instant), Bank Transfer (1-2 business days), PayPal (2-3 business days)
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Withdrawal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b">
                        <span className="text-sm text-muted-foreground">Minimum Withdrawal</span>
                        <span className="font-medium">KSh 100</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b">
                        <span className="text-sm text-muted-foreground">Processing Fee</span>
                        <span className="font-medium">Free</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b">
                        <span className="text-sm text-muted-foreground">Daily Limit</span>
                        <span className="font-medium">KSh 50,000</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-muted-foreground">Monthly Limit</span>
                        <span className="font-medium">KSh 500,000</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                        <div className="text-sm">
                          <div className="font-medium text-yellow-800">Important Notes</div>
                          <ul className="mt-1 text-yellow-700 space-y-1">
                            <li>• Ensure your payment details are correct</li>
                            <li>• Withdrawals cannot be cancelled once processed</li>
                            <li>• Contact support for any issues</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <span>Earnings Overview</span>
                    </CardTitle>
                    <CardDescription>
                      Your feedback reward trends over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-2">
                          KSh {(totalEarnings / mockPayments.filter(p => p.type === 'earning').length).toFixed(0)}
                        </div>
                        <div className="text-sm text-muted-foreground">Average per feedback</div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">This Month</span>
                          <span className="font-medium text-green-600">KSh 1,850</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Last Month</span>
                          <span className="font-medium">KSh 1,200</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Growth</span>
                          <span className="font-medium text-green-600">+54%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Feedback Categories</CardTitle>
                    <CardDescription>
                      Earnings breakdown by feedback type
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { category: 'Structured Feedback', amount: 1100, percentage: 55 },
                        { category: 'General Feedback', amount: 750, percentage: 37.5 },
                        { category: 'Quality Bonus', amount: 200, percentage: 10 }
                      ].map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{item.category}</span>
                            <span className="text-muted-foreground">KSh {item.amount}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Chatbot />
    </div>
  )
}
