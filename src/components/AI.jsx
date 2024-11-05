import axios from "axios";
import { Send } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

function AI() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  async function generateAnswer(e) {
    setGeneratingAnswer(true);
    e.preventDefault();
    setAnswer("Loading your answer... \n It might take up to 10 seconds");
    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDLflrlgC8YthAPU19lbm-UQfSNqtMRFgQ`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

      setAnswer(
        response["data"]["candidates"][0]["content"]["parts"][0]["text"]
      );
    } catch (error) {
      console.log(error);
      setAnswer("Sorry - Something went wrong. Please try again!");
    }

    setGeneratingAnswer(false);
  }

  return (
    <div className="bg-[#dfcdf1] h-screen p-4 flex flex-col justify-start items-center">
      <form
        onSubmit={generateAnswer}
        className="w-full md:w-3/3 lg:w-1/2 xl:w-1/3 min-h-[300px] min-w-[900px] text-center rounded-lg shadow-lg bg-white py-6 px-4 transition-all duration-500 transform hover:scale-105"
      >
        <h1 className="text-4xl font-bold text-black-800 mb-4 animate-pulse">AI Doctor</h1>
        <textarea
          required
          className="border border-gray-300 rounded w-full my-2 min-h-fit p-3 transition-all duration-300 focus:border-blue-400 focus:shadow-lg"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask AI Doctor any Health related questions!"
        ></textarea>
        <button
          type="submit"
          className={`flex items-center bg-purple-500 text-white p-3 mr-4 mt-10 rounded-md hover:bg-purple-600 transition-all duration-300 ${generatingAnswer ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          disabled={generatingAnswer}
        >
          Send <Send className="ml-2" />
        </button>
      </form>
      <div className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 min-w-[900px] rounded-lg bg-white my-4 shadow-lg transition-all duration-500 transform hover:scale-105">
        <div className="p-4 max-h-[400px] overflow-y-auto">
          <ReactMarkdown>{answer}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export default AI;
