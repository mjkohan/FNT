"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { 
  User, 
  Mail, 
  Calendar, 
  
  Shield,
  Key,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from "lucide-react";

// Validation schemas
const updateEmailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type UpdateEmailForm = z.infer<typeof updateEmailSchema>;
type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  
  // Initialize profile data from session
  const [profileData, setProfileData] = useState({
    email: session?.user?.email || "",
    createdAt: session?.user?.createdAt || "",
  });
  

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/users/profile');
      if (response.ok) {
        const data = await response.json();
        const userData = {
          email: data.user.email || "",
          createdAt: data.user.createdAt || "",
        };
        setProfileData(userData);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Update profile data when session changes
  useEffect(() => {
    if (session?.user) {
      const userData = {
        email: session.user.email || "",
        createdAt: session.user.createdAt || "",
      };
      setProfileData(userData);
      
      // Also fetch fresh data from backend
      fetchUserProfile();
    }
  }, [session]);

  // API functions
  const updateEmail = async (email: string) => {
    const response = await fetch('/api/users/email', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update email');
    }

    return response.json();
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    const response = await fetch('/api/users/password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to change password');
    }

    return response.json();
  };

 

  // Email form
  const emailForm = useForm<UpdateEmailForm>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: { email: profileData.email },
  });

  // Password form
  const passwordForm = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onEmailSubmit = async (data: UpdateEmailForm) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateEmail(data.email);
      setProfileData(prev => ({ ...prev, email: data.email }));
      setSuccess('Email updated successfully!');
      toast.success('Email updated successfully!');
      
      // Update session
      if (session) {
        await update({
          ...session,
          user: {
            ...session.user,
            email: data.email,
          },
        });
      }
      
      emailForm.reset({ email: data.email });
      
      // Close the dialog
      setIsEmailDialogOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update email';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: ChangePasswordForm) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await changePassword(data.currentPassword, data.newPassword);
      setSuccess('Password changed successfully!');
      toast.success('Password changed successfully!');
      passwordForm.reset();
      
      // Close the dialog
      setIsPasswordDialogOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to change password';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset forms when dialogs are closed
  const handleEmailDialogClose = (open: boolean) => {
    setIsEmailDialogOpen(open);
    if (!open) {
      emailForm.reset({ email: profileData.email });
      setError(null);
      setSuccess(null);
    }
  };

  const handlePasswordDialogClose = (open: boolean) => {
    setIsPasswordDialogOpen(open);
    if (!open) {
      passwordForm.reset();
      setError(null);
      setSuccess(null);
    }
  };

  // Format join date
  const formatJoinDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <div className="space-y-6 w-full px-4 mt-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchUserProfile}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="xl:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
              </CardTitle>
              
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {profileData.email ? profileData.email[0].toUpperCase() : 'U'}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">
                    {profileData.email || 'User'}
                  </h3>
                  <p className="text-muted-foreground">
                    Member since {formatJoinDate(profileData.createdAt)}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </Label>
                  
                    <p className="text-sm font-medium">{profileData.email || 'Not set'}</p>
                  
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Account Created
                  </Label>
                  <p className="text-sm font-medium">
                    {formatJoinDate(profileData.createdAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security
              </CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Change Email Dialog */}
              <Dialog open={isEmailDialogOpen} onOpenChange={handleEmailDialogClose}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    Change Email
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Email Address</DialogTitle>
                    <DialogDescription>
                      Enter your new email address. You&apos;ll need to verify it before it becomes active.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">New Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter new email"
                        {...emailForm.register("email")}
                      />
                      {emailForm.formState.errors.email && (
                        <p className="text-sm text-red-600">
                          {emailForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Updating...' : 'Update Email'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Change Password Dialog */}
              <Dialog open={isPasswordDialogOpen} onOpenChange={handlePasswordDialogClose}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Key className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                      Enter your current password and choose a new one.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        placeholder="Enter current password"
                        {...passwordForm.register("currentPassword")}
                      />
                      {passwordForm.formState.errors.currentPassword && (
                        <p className="text-sm text-red-600">
                          {passwordForm.formState.errors.currentPassword.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="Enter new password"
                        {...passwordForm.register("newPassword")}
                      />
                      {passwordForm.formState.errors.newPassword && (
                        <p className="text-sm text-red-600">
                          {passwordForm.formState.errors.newPassword.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                        {...passwordForm.register("confirmPassword")}
                      />
                      {passwordForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-red-600">
                          {passwordForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Changing...' : 'Change Password'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
