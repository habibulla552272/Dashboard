"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight, Plus, Upload } from "lucide-react"
import { toast } from "sonner"


interface Blog {
  _id: string
  title: string
  description: string
  content: string
  image?: string
  createdAt: string
}

export function BlogsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const itemsPerPage = 10


  // Mock data matching the screenshot
  const mockBlogs: Blog[] = [
    {
      _id: "1",
      title: "Morskie Oko in the Tatra Mountains",
      description:
        "Escape to Serenity: A Glimpse of Morskie Oko in the Tatra Mountains Sometimes, an image arrives that ...",
      content: "Full blog content here...",
      image: "/mountain-landscape-blog.png",
      createdAt: "2025-06-11T00:00:00Z",
    },
    {
      _id: "2",
      title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec venenatis tellus in volutpat molestie...",
      content: "Full blog content here...",
      image: "/business-meeting-blog.png",
      createdAt: "2025-06-10T00:00:00Z",
    },
  ]

  const [blogs, setBlogs] = useState<Blog[]>(mockBlogs)

  const totalPages = Math.ceil(blogs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentBlogs = blogs.slice(startIndex, endIndex)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddBlog = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newBlog: Blog = {
      _id: Date.now().toString(),
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      content: formData.get("content") as string,
      image: imagePreview || "/blog-thumbnail.png",
      createdAt: new Date().toISOString(),
    }

    setBlogs([...blogs, newBlog])
    setIsAddOpen(false)
    setSelectedImage(null)
    setImagePreview("")
    toast({ title: "Blog added successfully" })
    console.log("[v0] Added new blog:", newBlog)
  }

  const handleEditBlog = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingBlog) return

    const formData = new FormData(e.currentTarget)
    const updatedBlog: Blog = {
      ...editingBlog,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      content: formData.get("content") as string,
      image: imagePreview || editingBlog.image,
    }

    setBlogs(blogs.map((blog) => (blog._id === editingBlog._id ? updatedBlog : blog)))
    setIsEditOpen(false)
    setEditingBlog(null)
    setSelectedImage(null)
    setImagePreview("")
    toast({ title: "Blog updated successfully" })
    console.log("[v0] Updated blog:", updatedBlog)
  }

  const handleView = (blog: Blog) => {
    console.log("[v0] Viewing blog:", blog)
    // TODO: Implement view blog functionality
  }

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog)
    setImagePreview(blog.image || "")
    setIsEditOpen(true)
  }

  const handleDelete = (blogId: string) => {
    setBlogs(blogs.filter((blog) => blog._id !== blogId))
    toast({ title: "Blog deleted successfully" })
    console.log("[v0] Deleted blog:", blogId)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Blogs</h1>
          <p className="text-sm text-gray-500">Dashboard &gt; Blogs</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Blog
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Blog</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddBlog} className="space-y-4">
              <div>
                <Label htmlFor="add-title">Blog Title</Label>
                <Input id="add-title" name="title" required placeholder="Enter blog title" />
              </div>
              <div>
                <Label htmlFor="add-description">Description</Label>
                <Textarea
                  id="add-description"
                  name="description"
                  required
                  placeholder="Enter blog description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="add-content">Content</Label>
                <Textarea id="add-content" name="content" required placeholder="Enter blog content" rows={5} />
              </div>
              <div>
                <Label htmlFor="add-image">Blog Image</Label>
                <div className="mt-2">
                  <Input id="add-image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("add-image")?.click()}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-32 h-20 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Add Blog
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Blogs Table */}
      <div className="bg-white rounded-lg border">
        {/* Table Header */}
        <div className="grid grid-cols-3 gap-4 p-4 border-b bg-gray-50 font-medium text-gray-700">
          <div>Blog Name</div>
          <div>Added</div>
          <div>Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y">
          {currentBlogs.map((blog) => (
            <div key={blog._id} className="grid grid-cols-3 gap-4 p-4 items-center">
              {/* Blog Name Column */}
              <div className="flex items-start space-x-3">
                <img
                  src={blog.image || "/placeholder.svg?height=60&width=80&query=blog+thumbnail"}
                  alt={blog.title}
                  className="w-20 h-15 object-cover rounded flex-shrink-0"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/blog-thumbnail.png"
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 mb-1 line-clamp-2">{blog.title}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{blog.description}</p>
                </div>
              </div>

              {/* Added Column */}
              <div>
                <p className="text-sm text-gray-600">{formatDate(blog.createdAt)}</p>
              </div>

              {/* Actions Column */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleView(blog)}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <Eye className="h-4 w-4 text-gray-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(blog)}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <Edit className="h-4 w-4 text-gray-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(blog._id)}
                  className="h-8 w-8 p-0 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, blogs.length)} of {blogs.length} results
          </p>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Blog Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Blog</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditBlog} className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Blog Title</Label>
              <Input
                id="edit-title"
                name="title"
                required
                defaultValue={editingBlog?.title}
                placeholder="Enter blog title"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                required
                defaultValue={editingBlog?.description}
                placeholder="Enter blog description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                name="content"
                required
                defaultValue={editingBlog?.content}
                placeholder="Enter blog content"
                rows={5}
              />
            </div>
            <div>
              <Label htmlFor="edit-image">Blog Image</Label>
              <div className="mt-2">
                <Input id="edit-image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("edit-image")?.click()}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New Image
                </Button>
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-32 h-20 object-cover rounded"
                    />
                  </div>
                )}
              </div>
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Update Blog
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
