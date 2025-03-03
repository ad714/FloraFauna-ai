import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import ScaleLoader from "react-spinners/ScaleLoader";
import bg1 from "../assets/Plant.jpg";

const AIResponse = () => {
  const aiResponseRef = useRef(null);
  const location = useLocation();
  const aiResponse = location.state?.aiResponse || null;
  const image = location.state?.image || null;
  const [loading, setLoading] = useState(true);

  const style = {
    backgroundImage: `url(${bg1})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ScaleLoader size={50} color={"#123abc"} loading={loading} />
      </div>
    );
  }

  // Handle missing AI response gracefully
  if (!aiResponse) {
    return (
      <main style={style}>
        <div className="lg:container mx-auto py-8 text-center text-gray-600">
          <p className="text-lg">No data available. Please try again with a different image.</p>
        </div>
      </main>
    );
  }

  // Extract AI response properties safely
  const species = aiResponse?.most_likely_species || {};
  const scientificName = species?.scientific_name || "Unknown";
  const commonNames = species?.common_names?.join(", ") || "N/A";
  const briefDescription = species?.brief_description || [];
  const confidenceLevel = species?.confidence_level ? `${Math.round(species.confidence_level * 100)}%` : "Unknown";
  const overallAppearance = aiResponse?.overall_appearance || "No details available.";
  const distinguishingFeatures = aiResponse?.distinguishing_features || [];
  const habitat = aiResponse?.habitat || "No information available.";
  const geographicLocation = aiResponse?.geographic_location || "Not specified.";
  const additionalResources = aiResponse?.links_to_additional_resources || [];

  return (
    <main style={style}>
      <div className="lg:container mx-auto py-8" ref={aiResponseRef}>
        <div className="backdrop-blur-sm rounded-xl shadow-md p-8 bg-white/10 backdrop-brightness-60">
          {image && <img src={image} className="w-100 h-80 rounded-xl mb-4" alt="Uploaded Species" />}

          <div className="pt-10">
            <p className="mb-2 text-slate-300 text-4xl font-semibold">{scientificName}</p>
            <p className="mb-2 text-slate-300 text-xl font-semibold">Common Names: {commonNames}</p>

            <p className="mb-2 text-slate-300">Brief Description:</p>
            <ul className="list-disc list-inside mb-4 text-slate-300">
              {briefDescription.length > 0 ? (
                briefDescription.map((desc, index) => <li key={index}>{desc}</li>)
              ) : (
                <li>No description available.</li>
              )}
            </ul>

            <p className="mb-2 text-slate-300">Confidence Level: {confidenceLevel}</p>
          </div>

          <div className="mt-4 pt-5">
            <hr className="border-t-2 border-gray-500 mx-auto w-full" />
          </div>

          <h2 className="text-xl font-semibold mt-8 text-slate-300">Overall Appearance:</h2>
          <p className="mb-4 text-slate-300">{overallAppearance}</p>

          <div className="mt-4 pt-5">
            <hr className="border-t-2 border-gray-500 mx-auto w-full" />
          </div>

          <h2 className="text-xl font-semibold pt-5 text-slate-300">Distinguishing Features:</h2>
          <ul className="list-disc list-inside mb-4">
            {distinguishingFeatures.length > 0 ? (
              distinguishingFeatures.map((feature, index) => <li key={index} className="text-slate-300">{feature}</li>)
            ) : (
              <li className="text-slate-300">No distinguishing features available.</li>
            )}
          </ul>

          <div className="mt-4 pt-5">
            <hr className="border-t-2 border-gray-500 mx-auto w-full" />
          </div>

          <h2 className="text-xl font-semibold pt-5 text-slate-300">Habitat:</h2>
          <p className="text-slate-300 mb-4">{habitat}</p>

          <div className="mt-4 pt-5">
            <hr className="border-t-2 border-gray-500 mx-auto w-full" />
          </div>

          <h2 className="text-xl font-semibold pt-5 text-slate-300">Geographic Location:</h2>
          <p className="text-slate-300 mb-4">{geographicLocation}</p>

          <div className="mt-4 pt-5">
            <hr className="border-t-2 border-gray-500 mx-auto w-full" />
          </div>

          <h2 className="text-xl font-semibold pt-5 text-slate-300">Links to Additional Resources:</h2>
          <ul className="list-disc list-inside">
            {additionalResources.length > 0 ? (
              additionalResources.map((resource, index) => (
                <li key={index} className="text-slate-300">
                  <a href={resource.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {resource.title}
                  </a>
                </li>
              ))
            ) : (
              <li className="text-slate-300">No additional resources available.</li>
            )}
          </ul>
        </div>
      </div>
    </main>
  );
};

export default AIResponse;
