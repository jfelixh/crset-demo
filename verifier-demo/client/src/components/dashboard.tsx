import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "@tanstack/react-router";
import {
  BadgeEuroIcon,
  CreditCardIcon,
  EuroIcon,
  HandCoinsIcon,
  PiggyBankIcon,
  TargetIcon,
  UserRoundCogIcon,
  WalletCardsIcon,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

const Dashboard = () => {
  const { givenName } = useAuth();

  return (
    <div className="grid grid-cols-[1fr_10fr_1fr] w-full min-h-[55vh] py-4">
      <div className="col-start-2 col-span-1 h-full w-full gap-6 flex flex-col">
        <h1 className="text-3xl font-bold flex justify-start">
          Welcome back, {givenName}
        </h1>
        <Separator />
        <div className="flex flex-row gap-4">
          <div className="flex flex-col gap-4 w-1/4">
            <Card className="">
              <CardContent className="mt-6">
                <Separator />
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      <div className="flex flex-row gap-2">
                        <TargetIcon size={20} />
                        <div>Overview</div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>Finance Overview</AccordionContent>
                    <AccordionContent>Order Overview</AccordionContent>
                    <AccordionContent>Standing Order</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      <div className="flex flex-row gap-2">
                        <WalletCardsIcon size={20} />
                        <div>Accounts</div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>My Accounts</AccordionContent>
                    <AccordionContent>Transaction Overview</AccordionContent>
                    <AccordionContent>Transfer Money</AccordionContent>
                    <AccordionContent>Foreign Transfer</AccordionContent>
                    <AccordionContent>Direct Debit Objection</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>
                      <div className="flex flex-row gap-2">
                        <PiggyBankIcon size={20} />
                        <div>Investments</div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>Orderbook</AccordionContent>
                    <AccordionContent>Buy Securities</AccordionContent>
                    <AccordionContent>Sell Securities</AccordionContent>
                    <AccordionContent>Savings Plans</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>
                      <div className="flex flex-row gap-2">
                        <BadgeEuroIcon size={20} />
                        <div>Financial Services</div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <Button asChild variant="ghost">
                        <Link
                          to="/apply-for-loan"
                          className="[&.active]:font-bold"
                        >
                          Apply for Loan
                        </Link>
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5">
                    <AccordionTrigger>
                      <div className="flex flex-row gap-2">
                        <UserRoundCogIcon size={20} />
                        <div>Administration</div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>Account details</AccordionContent>
                    <AccordionContent>Card Management</AccordionContent>
                    <AccordionContent>TAN Management</AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col gap-4 w-3/4">
            <div className="flex flex-row gap-4">
              <Card className="w-1/3">
                <CardHeader>
                  <div className="flex flex-row justify-between">
                    <CardTitle>Current Balance</CardTitle>
                    <EuroIcon size={20} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">€9,341.87</p>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-gray-500">
                    +20.1% from last month
                  </p>
                </CardFooter>
              </Card>
              <Card className="w-1/3">
                <CardHeader>
                  <div className="flex flex-row justify-between">
                    <CardTitle>Income</CardTitle>
                    <HandCoinsIcon size={20} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">€3,500.00</p>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-gray-500">-5.2% from last month</p>
                </CardFooter>
              </Card>
              <Card className="w-1/3">
                <CardHeader>
                  <div className="flex flex-row justify-between">
                    <CardTitle>Expense</CardTitle>
                    <CreditCardIcon size={20} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">€4,022.34</p>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-gray-500">
                    +15.6% from last month
                  </p>
                </CardFooter>
              </Card>
            </div>
            <Card className="">
              <CardHeader>
                <CardTitle>Income & Expenses</CardTitle>
                <CardDescription>
                  Get an overview of your financial situation in the past year.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="incomeAndExpense" className="">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="incomeAndExpense">
                      Income & Expense
                    </TabsTrigger>
                    <TabsTrigger value="absoluteIncome">
                      Absolute Income
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="incomeAndExpense">
                    <ChartContainer config={chartConfigIE}>
                      <LineChart
                        accessibilityLayer
                        data={IE}
                        margin={{
                          left: 12,
                          right: 12,
                        }}
                      >
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="month"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tickFormatter={(value) => `${value}€`}
                        />
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent />}
                        />
                        <Line
                          dataKey="income"
                          type="linear"
                          stroke="var(--color-income)"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          dataKey="expense"
                          type="linear"
                          stroke="var(--color-expense)"
                          strokeWidth={2}
                          dot={false}
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                      </LineChart>
                    </ChartContainer>
                  </TabsContent>
                  <TabsContent value="absoluteIncome">
                    <ChartContainer config={chartConfigAI}>
                      <BarChart accessibilityLayer data={AI}>
                        <CartesianGrid vertical={false} />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tickFormatter={(value) => `${value}€`}
                        />
                        <ChartTooltip
                          cursor={false}
                          content={
                            <ChartTooltipContent hideLabel hideIndicator />
                          }
                        />
                        <Bar dataKey="income">
                          <LabelList
                            className="fill-background"
                            position="insideTop"
                            dataKey="month"
                            fillOpacity={1}
                            formatter={(value: string) => value.slice(0, 3)}
                          />
                          {AI.map((item) => (
                            <Cell
                              key={item.month}
                              fill={
                                item.income > 0
                                  ? "hsl(var(--chart-2))"
                                  : "hsl(var(--chart-1))"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ChartContainer>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            <div className="flex flex-row gap-4">
              <Card className="flex flex-col w-1/2">
                <CardHeader>
                  <CardTitle>Expense breakdown</CardTitle>
                  <CardDescription>
                    What did you spend money on?
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                  <ChartContainer
                    config={chartConfigExpenseCategories}
                    className="mx-auto aspect-square max-h-[400px] [&_.recharts-text]:fill-background"
                  >
                    <PieChart>
                      <ChartTooltip
                        content={<ChartTooltipContent nameKey="percentage" />}
                      />
                      <Pie data={expenseCategories} dataKey="percentage">
                        <LabelList
                          dataKey="category"
                          className="fill-background"
                          stroke="none"
                          fontSize={12}
                          formatter={(
                            value: keyof typeof chartConfigExpenseCategories
                          ) => value}
                        />
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card className="flex flex-col w-1/2">
                <CardHeader>
                  <CardTitle>Top spenders</CardTitle>
                  <CardDescription>Your expenses, ranked.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={chartConfigExpenseCategories}
                    className="mx-auto aspect-square"
                  >
                    <BarChart
                      accessibilityLayer
                      data={expenseCategories.sort(
                        (a, b) => b.percentage - a.percentage
                      )}
                      layout="vertical"
                      margin={{
                        left: 35,
                      }}
                    >
                      <YAxis
                        dataKey="category"
                        type="category"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(
                          value: keyof typeof chartConfigExpenseCategories
                        ) => value}
                      />
                      <XAxis dataKey="percentage" type="number" hide />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Bar dataKey="percentage" layout="vertical" radius={5} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const IE = [
  { month: "January", income: 4000, expense: 4800 },
  { month: "February", income: 3000, expense: 2500 },
  { month: "March", income: 3000, expense: 2800 },
  { month: "April", income: 3000, expense: 2700 },
  { month: "May", income: 3000, expense: 1800 },
  { month: "June", income: 3000, expense: 2200 },
  { month: "July", income: 4000, expense: 4800 },
  { month: "August", income: 3000, expense: 2500 },
  { month: "September", income: 3000, expense: 2800 },
  { month: "October", income: 3000, expense: 2700 },
  { month: "November", income: 3000, expense: 1800 },
  { month: "December", income: 3500, expense: 2200 },
];

const AI = IE.map((item) => {
  return { month: item.month, income: item.income - item.expense };
});

const expenseCategories = [
  { category: "Groceries", percentage: 25, fill: "var(--color-groceries)" },
  { category: "Rent", percentage: 40, fill: "var(--color-rent)" },
  { category: "Utilities", percentage: 10, fill: "var(--color-utilities)" },
  { category: "Transport", percentage: 15, fill: "var(--color-transport)" },
  {
    category: "Entertainment",
    percentage: 10,
    fill: "var(--color-entertainment)",
  },
];

const chartConfigIE = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-2))",
  },
  expense: {
    label: "Expense",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const chartConfigAI = {
  income: {
    label: "Absolute Income",
  },
} satisfies ChartConfig;

const chartConfigExpenseCategories = {
  percentage: {
    label: "Percentage",
  },
  groceries: {
    label: "Groceries",
    color: "hsl(var(--chart-1))",
  },
  rent: {
    label: "Rent",
    color: "hsl(var(--chart-2))",
  },
  utilities: {
    label: "Utilities",
    color: "hsl(var(--chart-3))",
  },
  transport: {
    label: "Transport",
    color: "hsl(var(--chart-4))",
  },
  entertainment: {
    label: "Entertainment",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export default Dashboard;
