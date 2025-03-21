import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUpDown,
  Search,
  Tag,
  Package,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  Clock,
  ChevronUp,
  ChevronDown,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";
import { fetchProducts, Product } from "../../api/product";

// Define default image for products
const defaultImage = "https://portal.adia.com.au/nologo.png";

// Improved Professional ProductCard component
const ProductCard: React.FC<{
  product: Product;
  onEdit: (id: string) => void;
}> = ({ product, onEdit }) => {
  return (
    <Card className="relative h-full flex flex-col overflow-hidden rounded-lg shadow-md border-gray-100 bg-white">
      {/* Status Indicator - Simple dot instead of badge */}
      <div
        className="absolute top-2 right-2 w-3 h-3 rounded-full shadow-sm"
        style={{ backgroundColor: product.is_active ? "#10b981" : "#ef4444" }}
      ></div>
      {/* Image with Status Badge */}
      <div className="relative h-40 overflow-hidden bg-white">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="object-contain w-full h-full p-2"
          onError={(e) => {
            e.currentTarget.src = defaultImage;
          }}
        />
      </div>

      {/* Core Info Section - Streamlined */}
      <CardHeader className="pb-0 pt-3 px-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-gray-800 truncate max-w-xs">
            {product.name}
          </CardTitle>
          <p className="font-semibold text-lg text-gray-900">
            ₹{product.price.toFixed(2)}
          </p>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {product.category}{" "}
          {product.sub_category && `• ${product.sub_category}`}
        </p>
      </CardHeader>

      {/* Minimal Content Section */}
      <CardContent className="py-2 px-3 flex-grow">
        <p className="text-xs text-gray-600 line-clamp-1 mb-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-2">
          <div className="text-xs text-gray-500 flex items-center">
            <Tag className="h-3 w-3 mr-1 opacity-70" />
            <span className="truncate max-w-xs">{product.barcode}</span>
          </div>

          <div
            className={`text-xs px-2 py-0.5 rounded-full ${
              product.stock_quantity > 10
                ? "bg-green-100 text-green-800"
                : product.stock_quantity > 0
                ? "bg-amber-100 text-amber-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {product.stock_quantity > 0
              ? `${product.stock_quantity} in stock`
              : "Out of stock"}
          </div>
        </div>
      </CardContent>

      {/* Footer - Action Controls */}
      <CardFooter className="pt-2 pb-2 px-3 flex justify-end items-center border-t border-gray-100 bg-gray-50">
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="text-xs h-7 text-gray-700 hover:bg-gray-200"
            onClick={() => onEdit(product.id)}
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 text-gray-700 hover:bg-gray-200 rounded-full"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="text-xs cursor-pointer">
                <Eye className="h-3 w-3 mr-2 opacity-70" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs cursor-pointer">
                {product.is_active ? (
                  <>
                    <AlertTriangle className="h-3 w-3 mr-2 opacity-70" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3 w-3 mr-2 opacity-70" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs text-red-600 cursor-pointer">
                <Trash2 className="h-3 w-3 mr-2 opacity-70" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  );
};

// ProductList component with lazy loading and improved layout
const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [category, setCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [activeView, setActiveView] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Lazy loading variables
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 12;
  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductElementRef = useCallback(
    (node: HTMLDivElement | HTMLTableRowElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // Mock edit function
  const handleEdit = (id: string) => {
    console.log(`Editing product with ID: ${id}`);
    // Add your edit logic here
  };

  // Fetch products from API
  useEffect(() => {
    const fetchProductList = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProductList();
  }, []);

  // Filter and sort products when dependencies change
  useEffect(() => {
    let result = [...products];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.barcode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (category !== "all") {
      result = result.filter((product) => product.category === category);
    }

    // Filter by active state
    if (activeView === "active") {
      result = result.filter((product) => product.is_active);
    } else if (activeView === "inactive") {
      result = result.filter((product) => !product.is_active);
    }

    // Sort products
    result.sort((a, b) => {
      let valueA, valueB;

      switch (sortBy) {
        case "price":
          valueA = a.price;
          valueB = b.price;
          break;
        case "stock":
          valueA = a.stock_quantity;
          valueB = b.stock_quantity;
          break;
        case "popularity":
          valueA = a.units_sold;
          valueB = b.units_sold;
          break;
        case "updated":
          valueA = new Date(a.updated_at).getTime();
          valueB = new Date(b.updated_at).getTime();
          break;
        default: // name
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
      }

      if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
      if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredProducts(result);
    setPage(1); // Reset page when filters change
    setHasMore(true);
  }, [products, searchTerm, category, sortBy, sortOrder, activeView]);

  // Update displayed products when page or filtered products change
  useEffect(() => {
    const startIndex = 0;
    const endIndex = page * itemsPerPage;

    const newDisplayedProducts = filteredProducts.slice(startIndex, endIndex);
    setDisplayedProducts(newDisplayedProducts);

    if (endIndex >= filteredProducts.length) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [filteredProducts, page]);

  // Get unique categories from products
  const categories = Array.from(
    new Set(products.map((product) => product.category))
  );

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-[calc(100vh-90px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Product Inventory</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" />
            Advanced Filters
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button size="sm">
            <Package className="h-4 w-4 mr-1" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="space-y-4">
          {/* Filters and search */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Search by name, description or barcode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="w-full md:w-40">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-40">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="stock">Stock</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="updated">Last Updated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleSortOrder}
              className="w-9 h-9"
            >
              {sortOrder === "asc" ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            <div className="flex border rounded-md overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-none"
              >
                Grid
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="rounded-none"
              >
                Table
              </Button>
            </div>
          </div>

          {/* View tabs */}
          <Tabs
            value={activeView}
            onValueChange={setActiveView}
            className="w-full"
          >
            <TabsList className="grid w-full md:w-96 grid-cols-3">
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-500 flex justify-between items-center">
        <span>
          Showing {displayedProducts.length} of {filteredProducts.length}{" "}
          products
        </span>
        {hasMore && displayedProducts.length > 0 && (
          <span className="text-xs text-gray-400">Scroll to load more</span>
        )}
      </div>

      {/* Product display - Grid or Table View */}
      {filteredProducts.length > 0 ? (
        viewMode === "grid" ? (
          // Grid View
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedProducts.map((product, index) => {
              if (displayedProducts.length === index + 1) {
                return (
                  <div ref={lastProductElementRef as any} key={product.id}>
                    <ProductCard product={product} onEdit={handleEdit} />
                  </div>
                );
              } else {
                return (
                  <div key={product.id}>
                    <ProductCard product={product} onEdit={handleEdit} />
                  </div>
                );
              }
            })}
          </div>
        ) : (
          // Table View with adjusted width
          <div className="w-full overflow-x-auto">
            <div className="rounded-md border min-w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">Image</TableHead>
                    <TableHead className="w-1/4">Product</TableHead>
                    <TableHead className="w-1/6">Category</TableHead>
                    <TableHead className="text-right w-1/12">Price</TableHead>
                    <TableHead className="text-right w-1/12">Stock</TableHead>
                    <TableHead className="w-1/12">Status</TableHead>
                    <TableHead className="text-right w-1/12">Updated</TableHead>
                    <TableHead className="w-12 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedProducts.map((product, index) => (
                    <TableRow
                      key={product.id}
                      ref={
                        displayedProducts.length === index + 1
                          ? (lastProductElementRef as any)
                          : null
                      }
                    >
                      <TableCell>
                        <div className="h-10 w-10 rounded overflow-hidden bg-gray-100">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = defaultImage;
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-xs text-gray-500 truncate max-w-xs">
                            {product.barcode}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${product.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={
                            product.stock_quantity === 0
                              ? "text-red-500 font-medium"
                              : ""
                          }
                        >
                          {product.stock_quantity}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.is_active ? "default" : "destructive"
                          }
                          className={
                            product.is_active
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : ""
                          }
                        >
                          {product.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm text-gray-500">
                        {new Date(product.updated_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(product.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                {product.is_active ? (
                                  <>
                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg border">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">No products found</h3>
          <p className="mt-2 text-gray-500">
            Try adjusting your search or filter criteria
          </p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setCategory("all");
              setActiveView("all");
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Loading indicator for lazy loading */}
      {hasMore && displayedProducts.length > 0 && (
        <div className="flex justify-center my-6">
          <RefreshCw className="h-6 w-6 text-gray-400 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default ProductList;
