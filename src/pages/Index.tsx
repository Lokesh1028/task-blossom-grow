import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Clock, DollarSign, Users, Briefcase, Star, LogOut } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

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

  // Mock data for demonstration
  const featuredJobs = [
    {
      id: 1,
      title: "Full-Stack Web Developer",
      description: "Looking for an experienced developer to build a modern e-commerce platform using React and Node.js.",
      budget: "$3,000 - $5,000",
      duration: "2-3 months",
      skills: ["React", "Node.js", "MongoDB", "Express"],
      client: "TechStart Inc.",
      location: "Remote",
      posted: "2 hours ago",
      proposals: 12
    },
    {
      id: 2,
      title: "Mobile App UI/UX Design",
      description: "Need a talented designer to create intuitive user interfaces for our fitness tracking mobile app.",
      budget: "$1,500 - $2,500",
      duration: "3-4 weeks",
      skills: ["Figma", "UI/UX", "Mobile Design", "Prototyping"],
      client: "FitLife Co.",
      location: "Remote",
      posted: "5 hours ago",
      proposals: 8
    },
    {
      id: 3,
      title: "Content Writer for Tech Blog",
      description: "Seeking a skilled content writer to produce weekly articles about emerging technologies and trends.",
      budget: "$500 - $800",
      duration: "Ongoing",
      skills: ["Content Writing", "SEO", "Tech Writing", "Research"],
      client: "Digital Insights",
      location: "Remote",
      posted: "1 day ago",
      proposals: 15
    }
  ];

  const topFreelancers = [
    {
      id: 1,
      name: "Sarah Chen",
      title: "Full-Stack Developer",
      rating: 4.9,
      completedJobs: 47,
      skills: ["React", "Python", "AWS"],
      hourlyRate: "$85/hr",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Marcus Johnson",
      title: "UI/UX Designer",
      rating: 4.8,
      completedJobs: 32,
      skills: ["Figma", "Adobe XD", "Prototyping"],
      hourlyRate: "$75/hr",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      title: "Content Strategist",
      rating: 4.9,
      completedJobs: 28,
      skills: ["Content Writing", "SEO", "Marketing"],
      hourlyRate: "$60/hr",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ];

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
                {featuredJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                          {job.title}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {job.posted}
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
                          <span className="font-medium">{job.budget}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{job.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {job.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {job.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{job.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{job.proposals} proposals</span>
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => navigate('/find-jobs')}
                      >
                        Apply Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
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
                {topFreelancers.map((freelancer) => (
                  <Card key={freelancer.id} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                    <CardHeader className="text-center">
                      <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden">
                        <img
                          src={freelancer.image}
                          alt={freelancer.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {freelancer.name}
                      </CardTitle>
                      <CardDescription className="text-blue-600 font-medium">
                        {freelancer.title}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-center gap-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{freelancer.rating}</span>
                          <span className="text-gray-500 text-sm">({freelancer.completedJobs} jobs)</span>
                        </div>
                        <div className="text-center">
                          <span className="text-lg font-bold text-gray-900">{freelancer.hourlyRate}</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-1">
                          {freelancer.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => toast({
                          title: "Profile View",
                          description: `Viewing ${freelancer.name}'s profile`,
                        })}
                      >
                        View Profile
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
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
