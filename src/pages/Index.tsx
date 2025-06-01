
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Clock, DollarSign, Users, Briefcase, Star, LogOut } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Job {
  id: string;
  title: string;
  description: string;
  budget_min: number | null;
  budget_max: number | null;
  duration: string | null;
  skills_required: string[] | null;
  location: string | null;
  created_at: string;
  proposals_count: number | null;
  profiles: {
    full_name: string | null;
  } | null;
}

interface FreelancerProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  skills: string[] | null;
  hourly_rate: number | null;
  location: string | null;
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Fetch featured jobs from database
  const { data: featuredJobs = [] } = useQuery({
    queryKey: ['featured-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          profiles!jobs_client_id_fkey (
            full_name
          )
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching jobs:', error);
        return [];
      }
      return data as Job[];
    },
  });

  // Fetch top freelancers from database
  const { data: topFreelancers = [] } = useQuery({
    queryKey: ['top-freelancers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_freelancer', true)
        .not('hourly_rate', 'is', null)
        .order('hourly_rate', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching freelancers:', error);
        return [];
      }
      return data as FreelancerProfile[];
    },
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/find-jobs?search=${encodeURIComponent(searchQuery)}`);
    } else {
      toast({
        title: "Please enter a search term",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  const formatBudget = (min: number | null, max: number | null) => {
    if (min && max) {
      return `$${min} - $${max}`;
    } else if (min) {
      return `$${min}+`;
    } else if (max) {
      return `Up to $${max}`;
    }
    return "Budget not specified";
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">FreelanceHub</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => navigate('/find-jobs')} 
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Find Work
              </button>
              <button 
                onClick={() => navigate('/post-job')} 
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Find Talent
              </button>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">How it Works</a>
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Welcome, {user.email}</span>
                  <Button variant="outline" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Button variant="outline" className="ml-4" onClick={() => navigate('/auth')}>
                    Sign In
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/auth')}>
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find the perfect
            <span className="text-blue-600"> freelance </span>
            services for your business
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with skilled professionals around the world, or offer your expertise to clients who need it most.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for any service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-12 pr-4 py-4 text-lg rounded-full border-2 border-gray-200 focus:border-blue-500"
              />
              <Button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-blue-600 hover:bg-blue-700"
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Active Freelancers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">5,000+</div>
              <div className="text-gray-600">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="jobs" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-12">
              <TabsTrigger value="jobs" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Featured Jobs
              </TabsTrigger>
              <TabsTrigger value="freelancers" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Top Freelancers
              </TabsTrigger>
            </TabsList>

            <TabsContent value="jobs">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Job Opportunities</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Discover high-quality projects from verified clients around the world
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {featuredJobs.length > 0 ? featuredJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                          {job.title}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {formatTimeAgo(job.created_at)}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm text-gray-600 line-clamp-3">
                        {job.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-medium">{formatBudget(job.budget_min, job.budget_max)}</span>
                        </div>
                        {job.duration && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>{job.duration}</span>
                          </div>
                        )}
                        {job.location && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-1">
                          {job.skills_required?.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {job.skills_required && job.skills_required.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{job.skills_required.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{job.proposals_count || 0} proposals</span>
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => navigate('/find-jobs')}
                      >
                        Apply Now
                      </Button>
                    </CardFooter>
                  </Card>
                )) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500">No featured jobs available at the moment.</p>
                    <Button 
                      className="mt-4 bg-blue-600 hover:bg-blue-700"
                      onClick={() => navigate('/post-job')}
                    >
                      Post the First Job
                    </Button>
                  </div>
                )}
              </div>

              <div className="text-center">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={() => navigate('/find-jobs')}
                >
                  View All Jobs
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="freelancers">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Rated Freelancers</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Work with experienced professionals who deliver exceptional results
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {topFreelancers.length > 0 ? topFreelancers.map((freelancer) => (
                  <Card key={freelancer.id} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                    <CardHeader className="text-center">
                      <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden bg-gray-200">
                        {freelancer.avatar_url ? (
                          <img
                            src={freelancer.avatar_url}
                            alt={freelancer.full_name || 'Freelancer'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            <Users className="h-8 w-8" />
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {freelancer.full_name || 'Anonymous User'}
                      </CardTitle>
                      <CardDescription className="text-blue-600 font-medium">
                        {freelancer.bio?.split('.')[0] || 'Freelancer'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-center gap-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="font-medium">New</span>
                          <span className="text-gray-500 text-sm">(0 jobs)</span>
                        </div>
                        <div className="text-center">
                          <span className="text-lg font-bold text-gray-900">
                            ${freelancer.hourly_rate || 0}/hr
                          </span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-1">
                          {freelancer.skills?.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {freelancer.skills && freelancer.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{freelancer.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => toast({
                          title: "Profile View",
                          description: `Viewing ${freelancer.full_name || 'freelancer'}'s profile`,
                        })}
                      >
                        View Profile
                      </Button>
                    </CardFooter>
                  </Card>
                )) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500">No freelancers available at the moment.</p>
                    <Button 
                      className="mt-4 bg-blue-600 hover:bg-blue-700"
                      onClick={() => navigate('/auth')}
                    >
                      Join as a Freelancer
                    </Button>
                  </div>
                )}
              </div>

              <div className="text-center">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={() => toast({
                    title: "Browse Freelancers",
                    description: "Loading freelancer directory...",
                  })}
                >
                  Browse All Freelancers
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses and freelancers who trust FreelanceHub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
              onClick={() => navigate('/post-job')}
            >
              Post a Job
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg"
              onClick={() => navigate('/find-jobs')}
            >
              Start Freelancing
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Briefcase className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">FreelanceHub</span>
              </div>
              <p className="text-gray-400">
                Connecting talent with opportunity around the world.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Clients</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">How to Hire</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Talent Marketplace</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Project Catalog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Freelancers</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">How to Find Work</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Direct Contracts</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Find Freelance Jobs</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Leadership</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FreelanceHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
