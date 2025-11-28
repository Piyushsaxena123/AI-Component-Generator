import React, { useState } from 'react'
import Select from 'react-select';
import { BsStars, BsSun, BsMoonStars } from 'react-icons/bs';
import { HiOutlineCode } from 'react-icons/hi';
import Editor from '@monaco-editor/react';
import { IoCloseSharp, IoCopy } from 'react-icons/io5';
import { PiExportBold } from 'react-icons/pi';
import { ImNewTab } from 'react-icons/im';
import { FiRefreshCcw } from 'react-icons/fi';
import { GoogleGenAI } from "@google/genai";
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

const Home = () => {

  // ✅ Theme State (Defaulting to false/Light to match your image, toggle to go Dark)
  const [isDarkMode, setIsDarkMode] = useState(false);

  // ✅ Toggle Function
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const options = [
    { value: 'html-css', label: 'HTML + CSS' },
    { value: 'html-tailwind', label: 'HTML + Tailwind CSS' },
    { value: 'html-bootstrap', label: 'HTML + Bootstrap' },
    { value: 'html-css-js', label: 'HTML + CSS + JS' },
    { value: 'html-tailwind-bootstrap', label: 'HTML + Tailwind + Bootstrap' },
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [frameWork, setFrameWork] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  function extractCode(response) {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  }
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY
});

  async function getResponse() {
    if (!prompt.trim()) return toast.error("Please describe your component first");
    try {
      setLoading(true);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
      You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI components. 

Now, generate a UI component for: ${prompt}
Framework to use: ${frameWork.value}

Requirements:
- The code must be clean, well-structured, and easy to understand.
- Optimize for SEO where applicable.
- Focus on creating a modern, animated, and responsive UI design.
- Include high-quality hover effects, shadows, animations, colors, and typography.
- Return ONLY the code, formatted properly in **Markdown fenced code blocks**.
- Do NOT include explanations, text, comments, or anything else besides the code.
- And give the whole code in a single HTML file.
      `,
      });
      setCode(extractCode(response.text));
      setOutputScreen(true);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while generating code");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async () => {
    if (!code.trim()) return toast.error("No code to copy");
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error("Failed to copy");
    }
  };

  const downnloadFile = () => {
    if (!code.trim()) return toast.error("No code to download");
    const fileName = "GenUI-Code.html"
    const blob = new Blob([code], { type: 'text/plain' });
    let url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  };

  // ✅ Custom Styles for React Select that adapt to Theme
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: isDarkMode ? "#1a1a1a" : "#fff",
      borderColor: isDarkMode ? "#333" : "#ddd",
      color: isDarkMode ? "#fff" : "#000",
      boxShadow: "none",
      "&:hover": { borderColor: isDarkMode ? "#555" : "#bbb" }
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: isDarkMode ? "#1a1a1a" : "#fff",
      color: isDarkMode ? "#fff" : "#000",
      zIndex: 50
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? (isDarkMode ? "#333" : "#eee")
        : state.isFocused
          ? (isDarkMode ? "#222" : "#f5f5f5")
          : (isDarkMode ? "#1a1a1a" : "#fff"),
      color: isDarkMode ? "#fff" : "#000",
      "&:active": { backgroundColor: isDarkMode ? "#444" : "#ddd" }
    }),
    singleValue: (base) => ({ ...base, color: isDarkMode ? "#fff" : "#000" }),
    placeholder: (base) => ({ ...base, color: isDarkMode ? "#aaa" : "#666" }),
    input: (base) => ({ ...base, color: isDarkMode ? "#fff" : "#000" })
  };

  return (
    // ✅ Main Wrapper: Manually setting Background colors based on State
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-black text-white" : "bg-gray-100 text-gray-900"}`}>

      {/* ✅ Header */}
      <div className={`w-full flex items-center justify-between px-6 py-5 border-b transition-colors ${isDarkMode ? "bg-black border-zinc-800" : "bg-white border-gray-200"}`}>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          GenUI
        </h2>

        {/* ✅ Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all border ${isDarkMode ? "bg-zinc-900 border-zinc-700 text-yellow-400 hover:bg-zinc-800" : "bg-gray-50 border-gray-300 text-purple-600 hover:bg-gray-200"}`}
        >
          {isDarkMode ? <BsSun size={20} /> : <BsMoonStars size={20} />}
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 lg:px-16 pb-10 mt-8">

        {/* Left Section: Inputs */}
        <div className={`w-full py-6 rounded-xl p-5 shadow-sm border transition-colors ${isDarkMode ? "bg-[#0d0d0d] border-zinc-800" : "bg-white border-gray-200"}`}>
          <h3 className={`text-[25px] font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>AI Component Generator</h3>
          <p className={`mt-2 text-[16px] ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Describe your component and let AI code it for you.</p>

          <p className={`text-[15px] font-[700] mt-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Framework</p>
          <Select
            className='mt-2'
            options={options}
            value={frameWork}
            styles={selectStyles}
            onChange={(selected) => setFrameWork(selected)}
          />

          <p className={`text-[15px] font-[700] mt-5 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Describe your component</p>
          <textarea
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            className={`w-full min-h-[200px] rounded-xl mt-3 p-3 outline-none border resize-none transition-colors focus:ring-2 focus:ring-purple-500 ${isDarkMode ? "bg-[#1a1a1a] text-white border-zinc-700 placeholder-gray-500" : "bg-gray-50 text-gray-900 border-gray-200 placeholder-gray-400"}`}
            placeholder="Describe your component in detail and AI will generate it..."
          ></textarea>

          <div className="flex items-center justify-between mt-3">
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Click on generate button to get your code</p>
            <button
              onClick={getResponse}
              className="flex items-center p-3 rounded-lg border-0 bg-gradient-to-r from-purple-500 to-purple-700 px-5 gap-2 text-white font-medium transition-all hover:opacity-90 hover:scale-105 active:scale-95"
            >
              {loading ? <ClipLoader color='white' size={18} /> : <BsStars />}
              Generate
            </button>
          </div>
        </div>

        {/* Right Section: Output */}
        <div className={`relative w-full h-[80vh] rounded-xl overflow-hidden shadow-sm border transition-colors ${isDarkMode ? "bg-[#0d0d0d] border-zinc-800" : "bg-white border-gray-200"}`}>
          {
            !outputScreen ? (
              <div className="w-full h-full flex items-center flex-col justify-center">
                <div className="p-5 w-[70px] flex items-center justify-center text-[30px] h-[70px] rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg">
                  <HiOutlineCode />
                </div>
                <p className={`text-[16px] mt-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Your component & code will appear here.</p>
              </div>
            ) : (
              <>
                {/* Tabs */}
                <div className={`w-full h-[50px] flex items-center gap-3 px-3 border-b ${isDarkMode ? "bg-[#111] border-zinc-800" : "bg-gray-100 border-gray-200"}`}>
                  <button
                    onClick={() => setTab(1)}
                    className={`w-1/2 py-2 rounded-lg text-sm font-medium transition-all ${tab === 1 ? "bg-purple-600 text-white shadow" : (isDarkMode ? "text-gray-400 hover:bg-zinc-800" : "text-gray-600 hover:bg-gray-200")}`}
                  >
                    Code
                  </button>
                  <button
                    onClick={() => setTab(2)}
                    className={`w-1/2 py-2 rounded-lg text-sm font-medium transition-all ${tab === 2 ? "bg-purple-600 text-white shadow" : (isDarkMode ? "text-gray-400 hover:bg-zinc-800" : "text-gray-600 hover:bg-gray-200")}`}
                  >
                    Preview
                  </button>
                </div>

                {/* Toolbar */}
                <div className={`w-full h-[50px] flex items-center justify-between px-4 border-b ${isDarkMode ? "bg-[#111] border-zinc-800" : "bg-gray-100 border-gray-200"}`}>
                  <p className={`font-bold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Code Editor</p>
                  <div className="flex items-center gap-2">
                    {tab === 1 ? (
                      <>
                        <button onClick={copyCode} className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${isDarkMode ? "border-zinc-700 text-gray-300 hover:bg-zinc-800" : "border-gray-300 text-gray-600 hover:bg-gray-200"}`}><IoCopy /></button>
                        <button onClick={downnloadFile} className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${isDarkMode ? "border-zinc-700 text-gray-300 hover:bg-zinc-800" : "border-gray-300 text-gray-600 hover:bg-gray-200"}`}><PiExportBold /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setIsNewTabOpen(true)} className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${isDarkMode ? "border-zinc-700 text-gray-300 hover:bg-zinc-800" : "border-gray-300 text-gray-600 hover:bg-gray-200"}`}><ImNewTab /></button>
                        <button onClick={() => setRefreshKey(prev => prev + 1)} className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${isDarkMode ? "border-zinc-700 text-gray-300 hover:bg-zinc-800" : "border-gray-300 text-gray-600 hover:bg-gray-200"}`}><FiRefreshCcw /></button>
                      </>
                    )}
                  </div>
                </div>

                {/* Editor / Preview Area */}
                <div className="h-[calc(100%-100px)]">
                  {tab === 1 ? (
                    <Editor
                      value={code}
                      height="100%"
                      theme={isDarkMode ? 'vs-dark' : 'light'}
                      language="html"
                      options={{ minimap: { enabled: false }, fontSize: 14 }}
                    />
                  ) : (
                    <iframe key={refreshKey} srcDoc={code} className="w-full h-full bg-white text-black"></iframe>
                  )}
                </div>
              </>
            )
          }
        </div>
      </div>

      {/* Fullscreen Preview */}
      {isNewTabOpen && (
        <div className="fixed inset-0 bg-white w-screen h-screen z-50 flex flex-col">
          <div className="text-black w-full h-[60px] flex items-center justify-between px-5 bg-gray-100 border-b border-gray-300">
            <p className='font-bold text-lg'>Fullscreen Preview</p>
            <button onClick={() => setIsNewTabOpen(false)} className="w-10 h-10 rounded-xl border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors text-black">
              <IoCloseSharp size={20} />
            </button>
          </div>
          <div className="flex-grow relative">
            <iframe srcDoc={code} className="w-full h-full absolute inset-0"></iframe>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home