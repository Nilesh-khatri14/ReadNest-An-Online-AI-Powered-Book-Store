
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Edit2, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // If no user is found, redirect to login
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  // Function to handle edit profile (placeholder)
  const handleEditProfile = () => {
    toast({
      title: "Edit Profile",
      description: "This feature is coming soon!",
    });
  };
  
  if (!user) {
    return null; // Don't render anything while redirecting
  }
  
  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.name) return '?';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  // Mock dates for demonstration
  const joinDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-readnest-teal mb-6">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <Card>
          <CardHeader className="flex flex-col items-center pb-2">
            <Avatar className="h-24 w-24 mb-2">
              <AvatarImage src="/placeholder.svg" alt={user.name} />
              <AvatarFallback className="bg-readnest-teal text-white text-xl">{getUserInitials()}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Joined {joinDate}</span>
            </div>
            <Button onClick={handleEditProfile} className="w-full">
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </CardContent>
        </Card>
        
        {/* Account Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
                  <User className="h-4 w-4 mr-2" />
                  <span>Name</span>
                </div>
                <div className="text-readnest-teal font-medium">{user.name}</div>
              </div>
              
              <Separator />
              
              <div>
                <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>Email</span>
                </div>
                <div className="text-readnest-teal font-medium">{user.email}</div>
              </div>
              
              <Separator />
              
              <div>
                <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Account Status</span>
                </div>
                <div className="text-readnest-teal font-medium">Active</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Reading Preferences */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Reading Preferences</CardTitle>
            <CardDescription>Your favorite genres and authors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="bg-readnest-cream/30 text-readnest-teal px-3 py-1 rounded-full text-sm">Fantasy</div>
              <div className="bg-readnest-cream/30 text-readnest-teal px-3 py-1 rounded-full text-sm">Science Fiction</div>
              <div className="bg-readnest-cream/30 text-readnest-teal px-3 py-1 rounded-full text-sm">Mystery</div>
              <div className="bg-readnest-cream/30 text-readnest-teal px-3 py-1 rounded-full text-sm">Biography</div>
            </div>
            <Button variant="outline" onClick={handleEditProfile} className="text-readnest-teal">
              Update Preferences
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
