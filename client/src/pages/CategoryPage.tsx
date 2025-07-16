import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Upload, Image as ImageIcon, Search, Filter } from 'lucide-react';
import Axios from '@/utils/Axios';
import SummaryApi from '@/common/summaryApi';

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
  const [showDialog, setShowDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [filterParent, setFilterParent] = useState<string>('all');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    parentCategory: '',
  });

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || (!editingCategory && !imageFile)) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      if (formData.parentCategory) {
        formDataToSend.append('parentCategory', formData.parentCategory);
      }
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      let response;
      if (editingCategory) {
        response = await Axios({
          method: SummaryApi.updateCategory.method,
          url: `${SummaryApi.updateCategory.url}/${editingCategory._id}`,
          data: formDataToSend,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await Axios({
          method: SummaryApi.createCategory.method,
          url: SummaryApi.createCategory.url,
          data: formDataToSend,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      if (response.data.success) {
        toast({
          title: "Success",
          description: editingCategory ? "Category updated successfully" : "Category created successfully",
        });
        setShowDialog(false);
        resetForm();
        fetchCategories();
      }
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save category",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      parentCategory: category.parentCategory?._id || '',
    });
    setImagePreview(category.image.url);
    setShowDialog(true);
  };

  const handleDelete = async (categoryId: string) => {
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

  const resetForm = () => {
    setFormData({ name: '', parentCategory: '' });
    setImageFile(null);
    setImagePreview('');
    setEditingCategory(null);
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Category Management</h1>
          <p className="text-muted-foreground">Manage product categories and subcategories</p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} className="bg-gradient-luxury">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'Create Category'}</DialogTitle>
              <DialogDescription>
                {editingCategory ? 'Update the category details below' : 'Add a new category to your store'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentCategory">Parent Category (Optional)</Label>
                <Select value={formData.parentCategory} onValueChange={(value) => setFormData({...formData, parentCategory: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None (Main Category)</SelectItem>
                    {parentCategories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Category Image {!editingCategory && '*'}</Label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="cursor-pointer"
                    />
                  </div>
                  {imagePreview && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden border">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-gradient-luxury">
                  {submitting ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
                  <TableHead>Status</TableHead>
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
                      <Badge variant={category.isActive ? "default" : "destructive"}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(category.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(category)}
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
                                onClick={() => handleDelete(category._id)}
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
    </div>
  );
};

export default CategoryPage;