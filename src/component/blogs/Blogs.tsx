"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Edit, Trash2, Plus, Upload } from "lucide-react";
import { fetchBlog, fetchBlogs, serviceDelete, updateBlog } from "@/lib/api";
import { toast } from "sonner";
import Image from "next/image";
import Add from "./add/Add";
import { RichTextEditor } from "./editor/RichTextEditor";

interface Blog {
  _id: string;
  blogTitle: string;
  blogDescription: string;
  imageLink?: string;
  createdAt: string;
  updatedAt: string;
}

export function BlogsPage() {
  const [showAddForm, setShowAddForm] = useState(false);

  // edit dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    blogTitle: "",
    blogDescription: "",
  });
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // view details dialog
  const [viewId, setViewId] = useState<string | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  const queryClient = useQueryClient();

  // fetch all blogs
  const { data: blogda } = useQuery<{ data: Blog[] }>({
    queryKey: ["blogsData"],
    queryFn: fetchBlogs,
  });
  const blogsData: Blog[] = blogda?.data || [];

  // fetch single blog when viewing
  const { data: viewDa, isFetching: viewLoading } = useQuery<{ data: Blog }>({
    queryKey: ["singleBlog", viewId],
    queryFn: () => fetchBlog(viewId as string),
    enabled: !!viewId,
  });
  const viewData: Blog | null = viewDa?.data || null;

  // delete
  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: serviceDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogsData"] });
      toast.success("Blog deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete blog");
    },
  });

  // update
  const updateMutation = useMutation<void, Error, { id: string; data: { blogTitle: string; blogDescription: string }; image?: File }>({
    mutationFn: async ({ id, data, image }) => await updateBlog(id, data, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogsData"] });
      setIsEditDialogOpen(false);
      toast.success("Blog updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update blog");
    },
  });

  // handlers
  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleView = (id: string) => {
    setViewId(id);
    setViewOpen(true);
  };

  const handleEdit = (blog: Blog) => {
    setEditingId(blog._id);
    setEditFormData({
      blogTitle: blog.blogTitle,
      blogDescription: blog.blogDescription,
    });
    setEditImagePreview(blog.imageLink || null);
    setEditImageFile(null);
    setIsEditDialogOpen(true);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditDescriptionChange = (value: string) => {
    setEditFormData({
      ...editFormData,
      blogDescription: value,
    });
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImageFile(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingId) return;

    updateMutation.mutate({
      id: editingId,
      data: {
        blogTitle: editFormData.blogTitle,
        blogDescription: editFormData.blogDescription,
      },
      image: editImageFile || undefined,
    });
  };

  return (
    <section>
      <div className={`p-6 space-y-6 ${showAddForm ? "hidden" : "block"}`}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blogs</h1>
            <p className="text-gray-600 mt-1">Dashboard &gt; Blogs</p>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-blue-500 hover:bg-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            {showAddForm ? "Cancel" : "Add Blog"}
          </Button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[400px]">Blog</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogsData.length > 0 ? (
                blogsData.map((blog) => (
                  <TableRow key={blog._id}>
                    <TableCell>
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                          {blog.imageLink ? (
                            <Image
                              src={blog.imageLink}
                              alt={blog.blogTitle || "Blog image"}
                              className="object-cover"
                              width={64}
                              height={64}
                            />
                          ) : (
                            <span className="text-gray-400 text-xs">No Image</span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{blog.blogTitle}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2 max-w-40">{blog.blogDescription}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>{new Date(blog.updatedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleView(blog._id)}>
                          <Eye className="h-4 w-4 text-gray-600" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(blog)}>
                          <Edit className="w-4 h-4 text-gray-500" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(blog._id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    No blogs found. Add your first blog to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* VIEW DETAILS */}
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Blog Details</DialogTitle>
            </DialogHeader>
            {viewLoading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : viewData ? (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">{viewData.blogTitle}</h3>
                <p>{viewData.blogDescription}</p>
                {viewData.imageLink ? (
                  <Image
                    src={viewData.imageLink}
                    alt={viewData.blogTitle}
                    width={200}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-[200px] h-[200px] flex items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                    No Image
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500">Failed to load blog</p>
            )}
          </DialogContent>
        </Dialog>

        {/* EDIT BLOG DIALOG */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Blog</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-4">
                  <div>
                    <Label htmlFor="edit-blogTitle">Blog Title</Label>
                    <Input
                      id="edit-blogTitle"
                      name="blogTitle"
                      value={editFormData.blogTitle}
                      onChange={handleEditInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-blogDescription">Blog Content</Label>
                    <div className="mt-2">
                      <RichTextEditor
                        value={editFormData.blogDescription}
                        onChange={handleEditDescriptionChange}
                        placeholder="Write your blog content here..."
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Blog Image</Label>
                  <div className="mt-2 space-y-4">
                    <div className="border rounded-lg overflow-hidden">
                      {editImagePreview ? (
                        <Image
                          src={editImagePreview}
                          alt="Preview"
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">No image selected</span>
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        document.getElementById("edit-blog-image-upload")?.click()
                      }
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Change Image
                    </Button>
                    <input
                      id="edit-blog-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Updating..." : "Update Blog"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className={`${showAddForm ? "block" : "hidden"}`}>
        <Add showAddForm={showAddForm} setShowAddForm={setShowAddForm} />
      </div>
    </section>
  );
}
