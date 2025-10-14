import { useState, useEffect } from "react";
import NoResultFound from "./NoResultFound.jsx";
import { Upload, Link, Search, Shirt, Loader2, Image as ImageIcon, X } from 'lucide-react';

function App() {

  // --- State for Product Results ---
  const [allProducts, setAllProducts] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- State variables for all inputs ---
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  
  // NEW STATE: To hold the local URL for the image preview
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  // NEW STATE: For similarity score filtering
  const [similarityThreshold, setSimilarityThreshold] = useState(0); // Default to 0 (show all)


  // --- Filtering Logic ---
  useEffect(() => {
    let tempResults = allProducts;
    const threshold = similarityThreshold || 0;

    // 1. Filter by Similarity Score (Only apply if threshold > 0)
    if (threshold > 0) {
        tempResults = tempResults.filter(product => product.similarity_score >= threshold);
    }

    // 2. Filter by Search Keyword (Product Name)
    if (searchKeyword.trim()) {
      const regex = new RegExp(searchKeyword.trim(), 'i');
      tempResults = tempResults.filter(product => {
        return regex.test(product.product_name);
      });
    }

    setFilteredResults(tempResults);

  }, [searchKeyword, allProducts, similarityThreshold]);

  // --- Handlers for capturing inputs ---
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    // Create preview URL and clear URL input when a file is selected
    if (selectedFile) {
        setImagePreviewUrl(URL.createObjectURL(selectedFile));
        setImageUrl(""); // Clear URL input
    } else {
        setImagePreviewUrl(null);
    }
  };

  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
    
    // Clear file input and preview when user starts typing a URL
    setFile(null);
    setImagePreviewUrl(null);
    document.getElementById("fileInput").value = "";
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };
  
  const clearFileAndPreview = () => {
    setFile(null);
    setImagePreviewUrl(null);
    document.getElementById("fileInput").value = "";
  };


  // --- Submit Handlers ---
  const handleFileSubmit = async () => {
    // NOTE: Replace alert() with a custom UI modal for production
    if (!file) return console.error("Please select a file first!"); // Using console.error instead of alert

    setIsLoading(true); // Start loading
    const formData = new FormData();
    formData.append("file", file);
    if (category) formData.append("category", category);

    try {
      // Accessing VITE_BACKEND_URL directly here
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/search-by-file`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const newResults = data.results || [];

      setAllProducts(newResults);
      setFilteredResults(newResults);
      setIsLoaded(true); // Data has been loaded at least once

      setCategory("");
      clearFileAndPreview(); // Clear file and preview after submit

    } catch (error) {
      console.error("Error searching by file:", error);
      // Optionally handle error message display
    } finally {
      setIsLoading(false); // End loading
    }
  };


  const handleUrlSubmit = async () => {
    // NOTE: Replace alert() with a custom UI modal for production
    if (!imageUrl) return console.error("Please enter an image URL"); // Using console.error instead of alert

    setIsLoading(true); // Start loading
    const formData = new FormData();
    formData.append("image_url", imageUrl);
    if (category) formData.append("category", category);

    try {
      // Accessing VITE_BACKEND_URL directly here
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/search-by-url`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Search by URL response:", data);

      const newResults = data.results || [];

      setAllProducts(newResults);
      setFilteredResults(newResults);
      setIsLoaded(true); // Data has been loaded at least once

      setCategory("");
      setImageUrl("");
      setFile(null);
      setImagePreviewUrl(null); // Clear file and preview after submit
    } catch (err) {
      console.error("Error searching by URL:", err);
      // Optionally handle error message display
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-indigo-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ImageIcon className="text-indigo-600 w-9 h-9 transform rotate-3" />
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Visual Product Matcher</h1>
          </div>
          <p className="hidden md:block text-gray-500 text-base font-medium">Find similar products by vision technology</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">

        {/* Upload Section Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 mb-12 border border-gray-100 transform hover:shadow-indigo-300/50 transition duration-300">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-8 pb-4 border-b-4 border-indigo-500/50 flex items-center gap-3">
            <Upload className="text-indigo-600 w-7 h-7" /> Find Products by Image
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* File Upload Area (Col 1 & 2) */}
            <div className="lg:col-span-2">
              <label className="block text-lg font-semibold text-gray-700 mb-3">Upload File</label>
              <div className="border-4 border-dashed border-indigo-400/70 bg-indigo-50/50 rounded-2xl p-12 text-center transition duration-300 hover:border-indigo-600 hover:bg-indigo-100/70 shadow-inner">
                <p className="text-indigo-800 font-bold text-xl mb-6">Drop your image here, or use the button below</p>
                
                {/* Image Preview / Placeholder */}
                <div className="mb-6 flex justify-center h-40">
                  {imagePreviewUrl ? (
                    <div className="relative">
                        <img 
                            src={imagePreviewUrl} 
                            alt="Uploaded Preview" 
                            className="h-40 w-auto object-contain rounded-lg border-4 border-indigo-500 shadow-xl"
                        />
                        <button 
                            onClick={clearFileAndPreview}
                            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition"
                            aria-label="Remove uploaded image"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                  ) : (
                    <ImageIcon className="w-16 h-16 text-indigo-500/80" />
                  )}
                </div>

                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-4 block mx-auto text-sm text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-base file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition duration-200 cursor-pointer shadow-md hover:shadow-lg"
                />
                <button
                  className="mt-8 w-full md:w-auto px-12 py-4 bg-indigo-600 text-white font-bold rounded-full shadow-lg shadow-indigo-500/50 hover:bg-indigo-700 transition duration-200 transform hover:scale-[1.02] flex items-center justify-center mx-auto gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleFileSubmit}
                  disabled={isLoading || !file} 
                >
                  {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Search className="w-5 h-5" />}
                  {isLoading ? "Searching by File..." : "Search by Uploaded File"}
                </button>
              </div>
            </div>
            
            {/* Divider (Col 3) */}
            <div className="flex flex-row lg:flex-col items-center justify-center py-6 lg:py-0">
                <div className="flex-1 border-t-2 lg:border-t-0 lg:border-r-2 border-gray-200 w-full h-full"></div>
                <span className="px-6 text-gray-600 font-extrabold text-2xl lg:text-3xl text-indigo-400">OR</span>
                <div className="flex-1 border-t-2 lg:border-t-0 lg:border-r-2 border-gray-200 w-full h-full"></div>
            </div>

            {/* URL Input (Col 3) */}
            <div className="lg:col-span-1 flex flex-col justify-start">
                <label htmlFor="imageUrlInput" className="block text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Link className="text-indigo-600 w-5 h-5" /> Enter Image URL
                </label>
                <input
                    id="imageUrlInput"
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={handleUrlChange}
                    className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 shadow-inner text-base mb-6"
                />
                <button
                    className="w-full px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleUrlSubmit}
                    disabled={isLoading || !imageUrl}
                >
                    {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Search className="w-5 h-5" />}
                    {isLoading ? "Searching by URL..." : "Search by URL"}
                </button>
            </div>
          </div>


          {((file || imageUrl) || imagePreviewUrl) && (
            <div className="border-t-2 border-gray-100 pt-8 mt-10">
              <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                <Shirt className="text-indigo-500 w-5 h-5" /> Narrow Your Search (Optional)
              </h3>
              <div className="max-w-xs">
                {/* Category */}
                <div>
                  <label htmlFor="categorySelect" className="block text-sm font-medium text-gray-700 mb-2">Category Filter</label>
                  <select
                    id="categorySelect"
                    value={category}
                    onChange={handleCategoryChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-indigo-500 shadow-sm text-base bg-white"
                  >
                    <option value="">All Categories</option>
                    <option value="Men">Men's Apparel</option>
                    <option value="Women">Women's Apparel</option>
                    <option value="Kids">Kids' Apparel</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Section Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-8 pb-4 border-b-4 border-indigo-500/50 flex items-center gap-3">
            <Search className="text-indigo-600 w-7 h-7" /> Search Results
          </h2>

          {/* CONDITIONAL: Only show search bar if products have been loaded */}
          {isLoaded && (
            <div className="mb-10 flex flex-col md:flex-row gap-4 items-center">
              {/* Product Name Keyword Search */}
              <input
                type="text"
                placeholder="Filter results by product name..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="flex-1 w-full md:w-auto px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 shadow-inner text-base"
              />
              {/* Similarity Score Filter (NEW) */}
              <select
                value={similarityThreshold}
                onChange={(e) => setSimilarityThreshold(parseFloat(e.target.value))}
                className="w-full md:w-auto px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 shadow-inner text-base bg-white"
              >
                <option value={0}>Min. Similarity Score (All)</option>
                <option value={0.6}>0.6 or Higher (High Match)</option>
                <option value={0.5}>0.5 or Higher</option>
                <option value={0.4}>0.4 or Higher</option>
                <option value={0.3}>0.3 or Higher (Lower Match)</option>
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

            {/* 1. LOADING STATE */}
            {isLoading && (
              <div className="col-span-full py-16 text-center text-indigo-600">
                <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-indigo-500" />
                <p className="text-2xl font-semibold text-gray-700">Fetching products and matching features...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a moment.</p>
              </div>
            )}

            {/* 2. INITIAL STATE: If nothing is loaded yet and not currently loading */}
            {!isLoaded && !isLoading && allProducts.length === 0 && (
              <NoResultFound initialLoad={true} />
            )}

            {/* 3. RESULTS FOUND: Display the filtered list */}
            {isLoaded && !isLoading && filteredResults.length > 0 ? (
              filteredResults.map((item) => (
                <div
                  key={item.product_id}
                  className="bg-white p-5 border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl hover:shadow-indigo-100 transition duration-300 transform hover:-translate-y-2 flex flex-col items-center group"
                >
                  <div className="w-full h-48 overflow-hidden rounded-lg mb-4 bg-gray-100 border border-gray-100">
                    <img
                        src={item.image_url}
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/256x256/E5E7EB/4B5563?text=No+Image"; }}
                        alt={item.product_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-extrabold text-center text-xl text-gray-900 break-words w-full mt-2 group-hover:text-indigo-600 transition-colors duration-200">{item.product_name}</h3>
                  {/* Updated display to show Category instead of Product ID */}
                  <p className="text-sm font-medium text-gray-600 mt-1">
                    Category: <span className="font-semibold text-indigo-500">{item.category}</span>
                  </p>
                  {/* Display Similarity Score */}
                  <p className="text-sm text-gray-500 mt-1">
                    Similarity: <span className="font-mono text-xs font-bold text-green-600">{(item.similarity_score * 100).toFixed(2)}%</span>
                  </p>
                </div>
              ))
            ) : (
              /* 4. NO RESULTS FOUND: Display the NoResultFound component */
              isLoaded && !isLoading && <NoResultFound initialLoad={false} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
