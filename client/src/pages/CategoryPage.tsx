import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search, Filter, ArrowLeft } from 'lucide-react';
import Axios from '@/utils/Axios';
import SummaryApi from '@/common/summaryApi';
import UploadCategory from './UploadCategory';
import { useNavigate } from 'react-router-dom';

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: {
    url: string;
    public_id: string;
  };
  parentCategory?: {
    _id: string;
    name: string;
    slug: string;
  };
  subcategories?: Category[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const CategoryPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [filterParent, setFilterParent] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        method: SummaryApi.getAllCategories.method,
        url: SummaryApi.getAllCategories.url,
      });
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowUploadDialog(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowUploadDialog(true);
  };

  const handleUploadSuccess = () => {
    fetchCategories();
    setShowUploadDialog(false);
    setEditingCategory(null);
  };

  const handleUploadClose = () => {
    setShowUploadDialog(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const response = await Axios({
        method: SummaryApi.deleteCategory.method,
        url: `${SummaryApi.deleteCategory.url}/${categoryId}`,
      });
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Category deleted successfully",
        });
        fetchCategories();
      }
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterParent === 'all' || 
      (filterParent === 'main' && !category.parentCategory) ||
      (filterParent === 'sub' && category.parentCategory);
    return matchesSearch && matchesFilter;
  });

  const parentCategories = categories.filter(cat => !cat.parentCategory);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Back Button */}
      <Button
        variant="outline"
        className="mb-4 flex items-center gap-2"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Button>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Category Management</h1>
          <p className="text-muted-foreground">Manage product categories and subcategories</p>
        </div>
        <Button onClick={handleAddCategory} className="bg-gradient-luxury">
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Categories
          </CardTitle>
          <CardDescription>
            Manage your product categories and their hierarchy
          </CardDescription>
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterParent} onValueChange={setFilterParent}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="main">Main Categories</SelectItem>
                <SelectItem value="sub">Subcategories</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-muted-foreground">Loading categories...</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell>
                      <div className="w-12 h-12 rounded-lg overflow-hidden border">
                        <img 
                          src={category.image.url} 
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>
                      {category.parentCategory ? (
                        <Badge variant="outline">{category.parentCategory.name}</Badge>
                      ) : (
                        <Badge variant="secondary">Main Category</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(category.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCategory(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Category</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{category.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteCategory(category._id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Upload Category Dialog */}
      <UploadCategory
        open={showUploadDialog}
        onClose={handleUploadClose}
        onSuccess={handleUploadSuccess}
        editingCategory={editingCategory}
        parentCategories={parentCategories}
      />
    </div>
  );
};

export default CategoryPage;