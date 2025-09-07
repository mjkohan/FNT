"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Palette, 
  BarChart3, 
  Smartphone,
  Monitor,
  Moon,
  Sun,
  AlertTriangle,
  Save,
  RotateCcw,
  Download,
  Trash2,
  Eye,
  Lock,
  Mail as MailIcon,
  Shield as ShieldIcon,
  Globe as GlobeIcon,
  Bell as BellIcon,
  Key
} from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Account Settings
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    twoFactor: true,
    emailNotifications: true,
    smsNotifications: false,
    
    // Appearance
    theme: "system",
    language: "en",
    currency: "USD",
    timezone: "America/New_York",
    
    // Trading Preferences
    defaultChartType: "candlestick",
    chartTimeframe: "1h",
    autoRefresh: true,
    refreshInterval: 30,
    priceAlerts: true,
    volumeAlerts: true,
    
    // Privacy
    profileVisibility: "private",
    showPortfolio: false,
    showTrades: false,
    dataSharing: false,
    
    // Notifications
    priceChange: true,
    newsAlerts: true,
    marketOpen: true,
    weeklyReport: true,
    pushNotifications: true,
    emailDigest: true,
    
    // Security
    sessionTimeout: 30,
    loginAlerts: true,
    deviceAlerts: true,
    suspiciousActivity: true
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("account");

  const handleSettingChange = (key: string, value: unknown) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Here you would typically save to backend
    setHasChanges(false);
    // Show success message
  };

  const handleReset = () => {
    // Reset to default values
    setHasChanges(false);
  };

  const tabs = [
    { id: "account", label: "Account", icon: ShieldIcon },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "trading", label: "Trading", icon: BarChart3 },
    { id: "privacy", label: "Privacy", icon: Eye },
    { id: "notifications", label: "Notifications", icon: BellIcon },
    { id: "security", label: "Security", icon: Lock }
  ];

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MailIcon className="w-5 h-5" />
            Contact Information
          </CardTitle>
          <CardDescription>
            Update your email and phone number
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={settings.email}
              onChange={(e) => handleSettingChange("email", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={settings.phone}
              onChange={(e) => handleSettingChange("phone", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellIcon className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose how you want to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Button
              variant={settings.emailNotifications ? "default" : "outline"}
              size="sm"
              onClick={() => handleSettingChange("emailNotifications", !settings.emailNotifications)}
            >
              {settings.emailNotifications ? "Enabled" : "Disabled"}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
            </div>
            <Button
              variant={settings.smsNotifications ? "default" : "outline"}
              size="sm"
              onClick={() => handleSettingChange("smsNotifications", !settings.smsNotifications)}
            >
              {settings.smsNotifications ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Theme & Display
          </CardTitle>
          <CardDescription>
            Customize the appearance of your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <div className="flex gap-2">
              {[
                { value: "light", label: "Light", icon: Sun },
                { value: "dark", label: "Dark", icon: Moon },
                { value: "system", label: "System", icon: Monitor }
              ].map((theme) => {
                const Icon = theme.icon;
                return (
                  <Button
                    key={theme.value}
                    variant={settings.theme === theme.value ? "default" : "outline"}
                    onClick={() => handleSettingChange("theme", theme.value)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {theme.label}
                  </Button>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Language</Label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange("language", e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <select
                value={settings.currency}
                onChange={(e) => handleSettingChange("currency", e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTradingSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Chart Preferences
          </CardTitle>
          <CardDescription>
            Configure your default chart settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Default Chart Type</Label>
              <select
                value={settings.defaultChartType}
                onChange={(e) => handleSettingChange("defaultChartType", e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="candlestick">Candlestick</option>
                <option value="line">Line</option>
                <option value="area">Area</option>
                <option value="bar">Bar</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Default Timeframe</Label>
              <select
                value={settings.chartTimeframe}
                onChange={(e) => handleSettingChange("chartTimeframe", e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="1m">1 Minute</option>
                <option value="5m">5 Minutes</option>
                <option value="15m">15 Minutes</option>
                <option value="1h">1 Hour</option>
                <option value="4h">4 Hours</option>
                <option value="1d">1 Day</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto Refresh</Label>
              <p className="text-sm text-muted-foreground">Automatically refresh chart data</p>
            </div>
            <Button
              variant={settings.autoRefresh ? "default" : "outline"}
              size="sm"
              onClick={() => handleSettingChange("autoRefresh", !settings.autoRefresh)}
            >
              {settings.autoRefresh ? "Enabled" : "Disabled"}
            </Button>
          </div>
          {settings.autoRefresh && (
            <div className="space-y-2">
              <Label>Refresh Interval (seconds)</Label>
              <Input
                type="number"
                value={settings.refreshInterval}
                onChange={(e) => handleSettingChange("refreshInterval", parseInt(e.target.value))}
                min="10"
                max="300"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Alert Preferences
          </CardTitle>
          <CardDescription>
            Configure price and market alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Price Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified of price changes</p>
            </div>
            <Button
              variant={settings.priceAlerts ? "default" : "outline"}
              size="sm"
              onClick={() => handleSettingChange("priceAlerts", !settings.priceAlerts)}
            >
              {settings.priceAlerts ? "Enabled" : "Disabled"}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Volume Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified of unusual volume</p>
            </div>
            <Button
              variant={settings.volumeAlerts ? "default" : "outline"}
              size="sm"
              onClick={() => handleSettingChange("volumeAlerts", !settings.volumeAlerts)}
            >
              {settings.volumeAlerts ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Profile Visibility
          </CardTitle>
          <CardDescription>
            Control who can see your profile and activity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Profile Visibility</Label>
            <div className="flex gap-2">
              {[
                { value: "public", label: "Public" },
                { value: "private", label: "Private" },
                { value: "friends", label: "Friends Only" }
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={settings.profileVisibility === option.value ? "default" : "outline"}
                  onClick={() => handleSettingChange("profileVisibility", option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Show Portfolio Value</Label>
              <p className="text-sm text-muted-foreground">Display your portfolio value publicly</p>
            </div>
            <Button
              variant={settings.showPortfolio ? "default" : "outline"}
              size="sm"
              onClick={() => handleSettingChange("showPortfolio", !settings.showPortfolio)}
            >
              {settings.showPortfolio ? "Visible" : "Hidden"}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Show Trading Activity</Label>
              <p className="text-sm text-muted-foreground">Display your trading activity publicly</p>
            </div>
            <Button
              variant={settings.showTrades ? "default" : "outline"}
              size="sm"
              onClick={() => handleSettingChange("showTrades", !settings.showTrades)}
            >
              {settings.showTrades ? "Visible" : "Hidden"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GlobeIcon className="w-5 h-5" />
            Data Sharing
          </CardTitle>
          <CardDescription>
            Control how your data is used for analytics and improvements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label>Share Anonymous Data</Label>
              <p className="text-sm text-muted-foreground">Help improve our service with anonymous usage data</p>
            </div>
            <Button
              variant={settings.dataSharing ? "default" : "outline"}
              size="sm"
              onClick={() => handleSettingChange("dataSharing", !settings.dataSharing)}
            >
              {settings.dataSharing ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Market Notifications
          </CardTitle>
          <CardDescription>
            Choose which market events you want to be notified about
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "priceChange", label: "Price Changes", description: "Significant price movements" },
            { key: "newsAlerts", label: "News Alerts", description: "Breaking market news" },
            { key: "marketOpen", label: "Market Open/Close", description: "Market session notifications" },
            { key: "weeklyReport", label: "Weekly Reports", description: "Weekly market summary" }
          ].map((notification) => (
            <div key={notification.key} className="flex items-center justify-between">
              <div>
                <Label>{notification.label}</Label>
                <p className="text-sm text-muted-foreground">{notification.description}</p>
              </div>
              <Button
                variant={settings[notification.key as keyof typeof settings] ? "default" : "outline"}
                size="sm"
                onClick={() => handleSettingChange(notification.key, !settings[notification.key as keyof typeof settings])}
              >
                {settings[notification.key as keyof typeof settings] ? "Enabled" : "Disabled"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Delivery Methods
          </CardTitle>
          <CardDescription>
            Choose how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Browser and mobile push notifications</p>
            </div>
            <Button
              variant={settings.pushNotifications ? "default" : "outline"}
              size="sm"
              onClick={() => handleSettingChange("pushNotifications", !settings.pushNotifications)}
            >
              {settings.pushNotifications ? "Enabled" : "Disabled"}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Digest</Label>
              <p className="text-sm text-muted-foreground">Daily summary of market activity</p>
            </div>
            <Button
              variant={settings.emailDigest ? "default" : "outline"}
              size="sm"
              onClick={() => handleSettingChange("emailDigest", !settings.emailDigest)}
            >
              {settings.emailDigest ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldIcon className="w-5 h-5" />
            Authentication
          </CardTitle>
          <CardDescription>
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={settings.twoFactor ? "default" : "secondary"}>
                {settings.twoFactor ? "Enabled" : "Disabled"}
              </Badge>
              <Button variant="outline" size="sm">
                {settings.twoFactor ? "Manage" : "Enable"}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Session Timeout</Label>
            <select
              value={settings.sessionTimeout}
              onChange={(e) => handleSettingChange("sessionTimeout", parseInt(e.target.value))}
              className="w-full p-2 border rounded-md"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="240">4 hours</option>
              <option value="480">8 hours</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Security Alerts
          </CardTitle>
          <CardDescription>
            Configure security-related notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "loginAlerts", label: "Login Alerts", description: "Notify when someone logs into your account" },
            { key: "deviceAlerts", label: "New Device Alerts", description: "Notify when logging in from a new device" },
            { key: "suspiciousActivity", label: "Suspicious Activity", description: "Notify of potentially suspicious activity" }
          ].map((alert) => (
            <div key={alert.key} className="flex items-center justify-between">
              <div>
                <Label>{alert.label}</Label>
                <p className="text-sm text-muted-foreground">{alert.description}</p>
              </div>
              <Button
                variant={settings[alert.key as keyof typeof settings] ? "default" : "outline"}
                size="sm"
                onClick={() => handleSettingChange(alert.key, !settings[alert.key as keyof typeof settings])}
              >
                {settings[alert.key as keyof typeof settings] ? "Enabled" : "Disabled"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Password & Security
          </CardTitle>
          <CardDescription>
            Manage your password and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            <Lock className="w-4 h-4 mr-2" />
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Download className="w-4 h-4 mr-2" />
            Download Account Data
          </Button>
          <Button variant="destructive" className="w-full justify-start">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "account":
        return renderAccountSettings();
      case "appearance":
        return renderAppearanceSettings();
      case "trading":
        return renderTradingSettings();
      case "privacy":
        return renderPrivacySettings();
      case "notifications":
        return renderNotificationSettings();
      case "security":
        return renderSecuritySettings();
      default:
        return renderAccountSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        {hasChanges && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="xl:col-span-1">
          <Card className="hidden xl:block">
            <CardContent className="p-0">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        activeTab === tab.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
          
          {/* Mobile Navigation */}
          <div className="xl:hidden">
            <div className="flex flex-wrap gap-2 mb-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab(tab.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="xl:col-span-3">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
