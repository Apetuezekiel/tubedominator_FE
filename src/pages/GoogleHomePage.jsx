/* eslint-disable */

import homeImage from "../assets/images/HomeImage.png";
import homeBg from "../assets/images/homeBg.png";
import { Link } from "react-router-dom";

function GoogleHomePage() {
  return (
    <div
      className="w-full min-h-screen pt-20"
      style={{ backgroundImage: `url(${homeBg})`, backgroundSize: "cover" }}
    >
      <section className="hero flex justify-center w-full h-1/2">
        <div className="w-full">
          <div className="flex flex-col justify-between items-center bg-black-900 mr-10">
            <div
              className="px-4 py-2 w-60 rounded-full"
              style={{ backgroundColor: "#F5F2FE", color: "#8754FE" }}
            >
              #1 YouTube SEO Software
            </div>
            <img src={homeImage} alt="" className="rounded-xl my-5" />
            <div className="text-black mt-5 font-semibold text-xl">
              What we do with your data?
            </div>
            <div className="mt-5 w-1/2 text-center">
              Tubedominator is dedicated to enhancing the user experience for
              YouTube content creators by providing a suite of features designed
              to optimize content strategy and boost overall performance. Our
              commitment to data security is paramount, and we adhere to
              Google's policies in ensuring the responsible handling of
              sensitive user data.
            </div>
            <div className="text-black mt-5 font-semibold text-xl">
              TubeDominator's User-Enhancing Features:
            </div>
            <div className="mt-2 w-1/2 text-center">
              TubeDominator is designed to elevate the user experience for
              YouTube content creators by offering a robust set of features that
              significantly enhance functionality. Here's an overview of each
              feature and how it contributes to empowering content creators:
            </div>
            <div class="my-5 w-1/2">
              <ol>
                <li class="mb-4">
                  <p class="font-semibold">1. Keyword Generation:</p>
                  <ul>
                    <li class="pl-5">
                      Provides accurate potential views and success
                      probabilities.
                      <br />
                      Helps content creators optimize their video content for
                      better discoverability by leveraging insights from YouTube
                      search and keyword data.
                    </li>
                  </ul>
                </li>
                <li class="mb-4">
                  <p class="font-semibold">2. Competitor Metrics:</p>
                  <ul>
                    <li class="pl-5">
                      Enables content creators to stay ahead of the curve by
                      understanding competitor strategies, allowing them to
                      refine their own content and strategies accordingly.
                    </li>
                  </ul>
                </li>
                <li class="mb-4">
                  <p class="font-semibold">3. AI-Driven Optimization</p>
                  <ul>
                    <li class="pl-5">
                      Enables content creators to stay ahead of the curve by
                      understanding competitor strategies, allowing them to
                      refine their own content and strategies accordingly.
                    </li>
                  </ul>
                </li>
                <li class="mb-4">
                  <p class="font-semibold">4. Idea Organization:</p>
                  <ul>
                    <li class="pl-5">
                      Facilitates efficient content planning and organization,
                      ensuring that creators can easily retrieve and implement
                      their ideas to maintain a consistent and effective content
                      strategy.
                    </li>
                  </ul>
                </li>
                <li class="mb-4">
                  <p class="font-semibold">5. Performance Metrics:</p>
                  <ul>
                    <li class="pl-5">
                      Provides content creators with precise analytics based on
                      sensitive user data, enabling them to measure the success
                      of their content and make informed decisions for future
                      creations.
                    </li>
                  </ul>
                </li>
                <li class="mb-4">
                  <p class="font-semibold">6. AI-Generated Posts:</p>
                  <ul>
                    <li class="pl-5">
                      TubeDominator's AI-Generated Posts feature harnesses the
                      power of generative AI to revolutionize the process of
                      creating YouTube content. This innovative capability goes
                      beyond conventional content creation by dynamically
                      generating posts that encompass all essential elements for
                      optimal YouTube ranking.
                    </li>
                  </ul>
                </li>
                <li class="mb-4">
                  <p class="font-semibold">7. Update YouTube Video:</p>
                  <ul>
                    <li class="pl-5">
                      Empowers users to enhance and modify their YouTube posts
                      directly from the Tubedominator dashboard. After the
                      initial optimization process, content creators can
                      leverage this feature for ongoing adjustments and
                      improvements to their video content.
                    </li>
                  </ul>
                </li>
              </ol>
            </div>
            <div className="text-black font-semibold text-xl">
              Exclusivity of Data Usage
            </div>
            <div className="my-5 w-1/2 text-center">
              We want to assure you that the data accessed through Tubedominator
              will be used exclusively for the specified features mentioned
              above. Our commitment is unwavering, and we will not employ the
              data for any unauthorized or unrelated purposes. Your privacy and
              data security are of utmost importance to us, and we strictly
              adhere to the guidelines set forth by Google.
            </div>

            <Link
              to={"/privacy-policy"}
              style={{ color: "#9090F6" }}
              className="mb-10"
            >
              Read about our Privacy policy here
            </Link>
          </div>
        </div>
      </section>
      {/* <div className="relative h-1/2">
        <img
          src={homeImage}
          alt=""
          className="absolute left-1/2 transform -translate-x-1/2 bottom-0"
        />
      </div> */}
    </div>
  );
}

export default GoogleHomePage;
