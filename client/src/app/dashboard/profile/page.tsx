"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Phone, 
  Edit3, 
  Save, 
  X, 
  Camera,
  Shield,
  Bell,
  Globe,
  TrendingUp,
  BarChart3,
  Star
} from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: session?.user?.email || "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    joinDate: "January 2024",
    bio: "Financial markets enthusiast with 5+ years of trading experience. Passionate about crypto, stocks, and commodities analysis.",
    interests: ["Cryptocurrency", "Stock Trading", "Technical Analysis", "Market Research"],
    riskTolerance: "Moderate",
    tradingStyle: "Swing Trading",
    experience: "Intermediate"
  });

  const [editData, setEditData] = useState(profileData);

  const handleEdit = () => {
    setEditData(profileData);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const stats = [
    { label: "Portfolio Value", value: "$125,430", icon: TrendingUp, change: "+12.5%" },
    { label: "Active Trades", value: "23", icon: BarChart3, change: "+3 this week" },
    { label: "Watchlist Items", value: "47", icon: Star, change: "5 new" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel} className="gap-2">
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit} className="gap-2">
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="xl:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {profileData.firstName[0]}{profileData.lastName[0]}
                  </div>
                  {isEditing && (
                    <Button
                      size="icon"
                      className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full"
                      variant="secondary"
                    >
                      <Camera className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <Input
                          value={editData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          className="w-32"
                        />
                        <Input
                          value={editData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          className="w-32"
                        />
                      </div>
                    ) : (
                      `${profileData.firstName} ${profileData.lastName}`
                    )}
                  </h3>
                  <p className="text-muted-foreground">Member since {profileData.joinDate}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      value={editData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  ) : (
                    <p className="text-sm">{profileData.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={editData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  ) : (
                    <p className="text-sm">{profileData.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </Label>
                  {isEditing ? (
                    <Input
                      id="location"
                      value={editData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                    />
                  ) : (
                    <p className="text-sm">{profileData.location}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Join Date
                  </Label>
                  <p className="text-sm">{profileData.joinDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bio */}
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
              <CardDescription>
                Tell others about yourself and your trading experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <textarea
                  value={editData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="w-full min-h-[100px] p-3 border rounded-md resize-none"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-sm leading-relaxed">{profileData.bio}</p>
              )}
            </CardContent>
          </Card>

          {/* Trading Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Trading Preferences</CardTitle>
              <CardDescription>
                Your trading style and risk preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Risk Tolerance</Label>
                  {isEditing ? (
                    <select
                      value={editData.riskTolerance}
                      onChange={(e) => handleInputChange("riskTolerance", e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="Conservative">Conservative</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Aggressive">Aggressive</option>
                    </select>
                  ) : (
                    <Badge variant="secondary">{profileData.riskTolerance}</Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Trading Style</Label>
                  {isEditing ? (
                    <select
                      value={editData.tradingStyle}
                      onChange={(e) => handleInputChange("tradingStyle", e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="Day Trading">Day Trading</option>
                      <option value="Swing Trading">Swing Trading</option>
                      <option value="Position Trading">Position Trading</option>
                      <option value="Scalping">Scalping</option>
                    </select>
                  ) : (
                    <Badge variant="outline">{profileData.tradingStyle}</Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Experience Level</Label>
                  {isEditing ? (
                    <select
                      value={editData.experience}
                      onChange={(e) => handleInputChange("experience", e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  ) : (
                    <Badge variant="default">{profileData.experience}</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{stat.label}</p>
                        <p className="text-xs text-muted-foreground">{stat.change}</p>
                      </div>
                    </div>
                    <p className="font-semibold">{stat.value}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Interests */}
          <Card>
            <CardHeader>
              <CardTitle>Interests</CardTitle>
              <CardDescription>Your market interests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profileData.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Two-Factor Authentication</span>
                <Badge variant="outline">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Notifications</span>
                <Badge variant="outline">Enabled</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Change Password
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
