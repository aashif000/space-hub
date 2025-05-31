
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ExternalLink, Calendar, User, Search, Filter, Star } from 'lucide-react';

interface SpaceflightArticle {
  id: number;
  title: string;
  url: string;
  image_url: string;
  news_site: string;
  summary: string;
  published_at: string;
  updated_at: string;
  featured: boolean;
  authors: Array<{
    name: string;
    socials?: any;
  }>;
  launches: Array<{
    launch_id: string;
    provider: string;
  }>;
  events: Array<{
    event_id: number;
    provider: string;
  }>;
}

interface SpaceflightBlog {
  id: number;
  title: string;
  url: string;
  image_url: string;
  news_site: string;
  summary: string;
  published_at: string;
  updated_at: string;
  featured: boolean;
}

export const SpaceflightNewsExplorer = () => {
  const [articles, setArticles] = useState<SpaceflightArticle[]>([]);
  const [blogs, setBlogs] = useState<SpaceflightBlog[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    is_featured: false,
    has_event: false,
    has_launch: false,
    limit: 20
  });

  const fetchSpaceflightNews = async (type: 'articles' | 'blogs') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: filters.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(filters.is_featured && { is_featured: 'true' }),
        ...(filters.has_event && { has_event: 'true' }),
        ...(filters.has_launch && { has_launch: 'true' })
      });

      const response = await fetch(`https://api.spaceflightnewsapi.net/v4/${type}/?${params}`);
      const data = await response.json();
      
      if (type === 'articles') {
        setArticles(data.results || []);
      } else {
        setBlogs(data.results || []);
      }
    } catch (error) {
      console.error(`Error fetching spaceflight ${type}:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaceflightNews('articles');
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-6 border border-purple-500/30">
        <div className="flex items-center gap-3 mb-4">
          <Star className="w-8 h-8 text-purple-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Spaceflight News</h1>
            <p className="text-purple-200">Latest space industry news and articles</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={filters.is_featured}
                onChange={(e) => setFilters({...filters, is_featured: e.target.checked})}
                className="rounded"
              />
              <label htmlFor="featured" className="text-sm text-gray-300">Featured Only</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hasEvent"
                checked={filters.has_event}
                onChange={(e) => setFilters({...filters, has_event: e.target.checked})}
                className="rounded"
              />
              <label htmlFor="hasEvent" className="text-sm text-gray-300">Has Event</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hasLaunch"
                checked={filters.has_launch}
                onChange={(e) => setFilters({...filters, has_launch: e.target.checked})}
                className="rounded"
              />
              <label htmlFor="hasLaunch" className="text-sm text-gray-300">Has Launch</label>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={() => fetchSpaceflightNews('articles')} disabled={loading}>
              Search Articles
            </Button>
            <Button onClick={() => fetchSpaceflightNews('blogs')} disabled={loading} variant="outline">
              Search Blogs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="articles" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="blogs">Blogs</TabsTrigger>
        </TabsList>

        <TabsContent value="articles">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              articles.map((article) => (
                <Card key={article.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-purple-400 border-purple-500">
                        {article.news_site}
                      </Badge>
                      {article.featured && (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    {article.image_url && (
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-32 object-cover rounded-md mb-3"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    )}
                    <CardTitle className="text-sm text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-xs mb-3 line-clamp-3">
                      {article.summary}
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center text-gray-400">
                        <Calendar className="w-3 h-3 mr-2" />
                        {formatDate(article.published_at)}
                      </div>
                      {article.authors.length > 0 && (
                        <div className="flex items-center text-gray-400">
                          <User className="w-3 h-3 mr-2" />
                          {article.authors[0].name}
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex gap-1">
                          {article.launches.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {article.launches.length} Launch{article.launches.length > 1 ? 'es' : ''}
                            </Badge>
                          )}
                          {article.events.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {article.events.length} Event{article.events.length > 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                        <Button size="sm" variant="ghost" asChild className="h-6 text-xs">
                          <a href={article.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Read
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="blogs">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogs.map((blog) => (
              <Card key={blog.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-purple-400 border-purple-500">
                      {blog.news_site}
                    </Badge>
                    {blog.featured && (
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-sm text-white line-clamp-2">
                    {blog.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-xs mb-3 line-clamp-3">
                    {blog.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-400 text-xs">
                      <Calendar className="w-3 h-3 mr-2" />
                      {formatDate(blog.published_at)}
                    </div>
                    <Button size="sm" variant="ghost" asChild className="h-6 text-xs">
                      <a href={blog.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Read
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
