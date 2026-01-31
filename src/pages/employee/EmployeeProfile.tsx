import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Edit,
  Save,
  X,
  Upload,
} from 'lucide-react';

const EmployeeProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: 'Bhaira',
    email: 'bhaira@aselea.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, City, State 12345',
    dateOfBirth: '1990-05-15',
    joinDate: '2023-01-15',
    employeeId: 'EMP-2023-001',
    department: 'Engineering',
    position: 'Software Developer',
    reportingTo: 'John Manager',
    emergencyContact: '+1 (555) 987-6543',
    emergencyContactName: 'Jane Doe',
    bio: 'Passionate software developer with 5+ years of experience in web development.',
  });

  const handleSave = () => {
    // In a real app, this would save to backend
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string) => {
    setProfileData({ ...profileData, [field]: value });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 fade-in">
        {/* Profile Header */}
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar Section */}
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-primary/20">
                  <AvatarFallback className="bg-primary/20 text-primary text-3xl">
                    {profileData.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute bottom-0 right-0 rounded-full h-10 w-10 p-0"
                    variant="secondary"
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">{profileData.fullName}</h1>
                    <p className="text-lg text-muted-foreground mt-1">{profileData.position}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-primary/10">
                        {profileData.department}
                      </Badge>
                      <Badge variant="outline">ID: {profileData.employeeId}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)} className="glow-button">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        <Button onClick={handleSave} className="glow-button">
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button onClick={handleCancel} variant="outline">
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <div className="mt-4">
                    <Textarea
                      value={profileData.bio}
                      onChange={(e) => handleChange('bio', e.target.value)}
                      placeholder="Brief bio..."
                      className="bg-secondary border-border min-h-[80px]"
                    />
                  </div>
                ) : (
                  <p className="text-muted-foreground mt-4">{profileData.bio}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Full Name</Label>
                {isEditing ? (
                  <Input
                    value={profileData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    className="bg-secondary border-border"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p className="text-foreground">{profileData.fullName}</p>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-muted-foreground">Email Address</Label>
                {isEditing ? (
                  <Input
                    value={profileData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="bg-secondary border-border"
                    type="email"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-foreground">{profileData.email}</p>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-muted-foreground">Phone Number</Label>
                {isEditing ? (
                  <Input
                    value={profileData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="bg-secondary border-border"
                    type="tel"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-foreground">{profileData.phone}</p>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-muted-foreground">Address</Label>
                {isEditing ? (
                  <Textarea
                    value={profileData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="bg-secondary border-border"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p className="text-foreground">{profileData.address}</p>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-muted-foreground">Date of Birth</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-foreground">
                    {new Date(profileData.dateOfBirth).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employment Information */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Employment Information
              </CardTitle>
              <CardDescription>Your work-related details (read-only)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Employee ID</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/10">
                    {profileData.employeeId}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-muted-foreground">Department</Label>
                <p className="text-foreground">{profileData.department}</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-muted-foreground">Position</Label>
                <p className="text-foreground">{profileData.position}</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-muted-foreground">Reporting To</Label>
                <p className="text-foreground">{profileData.reportingTo}</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-muted-foreground">Join Date</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-foreground">
                    {new Date(profileData.joinDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-muted-foreground">Years of Service</Label>
                <p className="text-foreground">
                  {Math.floor(
                    (new Date().getTime() - new Date(profileData.joinDate).getTime()) /
                      (1000 * 60 * 60 * 24 * 365)
                  )}{' '}
                  years
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="glass-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Emergency Contact
              </CardTitle>
              <CardDescription>Contact information for emergencies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Contact Name</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.emergencyContactName}
                      onChange={(e) => handleChange('emergencyContactName', e.target.value)}
                      className="bg-secondary border-border"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <p className="text-foreground">{profileData.emergencyContactName}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Contact Number</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.emergencyContact}
                      onChange={(e) => handleChange('emergencyContact', e.target.value)}
                      className="bg-secondary border-border"
                      type="tel"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="text-foreground">{profileData.emergencyContact}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeProfile;
