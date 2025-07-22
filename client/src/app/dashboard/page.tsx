import { auth } from "@/auth"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) return null
  return (
      <Card className="shadow-xl border-border/50 bg-card/80 backdrop-blur-sm w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome, {session?.user?.email}!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This is your dashboard. You are logged in.</p>
        </CardContent>
      </Card>
    
  )
} 