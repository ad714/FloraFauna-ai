import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getBase64 } from "../helpers/imageHelper";
import UploadSection from "./Uploader/Uploader";
import { useNavigate } from "react-router-dom";
import prompt from "@/assets/prompt";
import ScaleLoader from "react-spinners/ScaleLoader";

const SpeciesInfo = () => {
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
  console.log("API Key:", import.meta.env.VITE_API_KEY); // Debugging API Key
  const navigate = useNavigate();

  const [image, setImage] = useState("");
  const [imageInlineData, setImageInlineData] = useState("");
  const [fileName, setFileName] = useState("No Selected File");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000); // Set loading time to 2 seconds

    return () => clearTimeout(timeout);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    getBase64(file)
      .then((result) => {
        setImage(result);
      })
      .catch((e) => console.log(e));

    fileToGenerativePart(file).then((image) => {
      setImageInlineData(image);
    });
  };

  async function fileToGenerativePart(file) {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(file);
    });

    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  }

  async function run() {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Using the latest available model
      const result = await model.generateContent([prompt, imageInlineData]);
      const response = await result.response;
      const text = await response.text();

      console.log("AI Raw Response:", text); // Debugging

      try {
        const jsonData = JSON.parse(text);
        console.log("Parsed AI Response:", jsonData);
        return jsonData;
      } catch (error) {
        console.warn("JSON Parsing Failed, Attempting Cleanup...");
        const startIndex = text.indexOf("{");
        const endIndex = text.lastIndexOf("}");
        
        if (startIndex !== -1 && endIndex !== -1) {
          try {
            const jsonData = JSON.parse(text.substring(startIndex, endIndex + 1));
            return jsonData;
          } catch (nestedError) {
            console.error("Failed to parse cleaned JSON:", nestedError);
          }
        }
      }
    } catch (error) {
      console.error("Error in AI response:", error);
    }
    return null; // Return null if AI response fails
  }

  const handleClick = async () => {
    setLoading(true); // Show loader
    const aiResponse = await run(); // Get AI response
    setLoading(false); // Hide loader

    if (aiResponse) {
      navigate("/results", { state: { aiResponse, image } });
    } else {
      console.error("AI Response is null, cannot navigate.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ScaleLoader size={50} color={"#ffffff"} loading={loading} />
      </div>
    );
  }

  return (
    <div className="mt-8">
      <UploadSection
        fileName={fileName}
        setFileName={setFileName}
        setImage={setImage}
        handleImageChange={handleImageChange}
        handleClick={handleClick}
        image={image}
      />
      <div className="flex justify-center items-center">
        <button
          onClick={handleClick}
          className="search-button bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SpeciesInfo;
