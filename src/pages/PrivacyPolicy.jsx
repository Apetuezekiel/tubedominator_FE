import React from "react";
import profileImage from "../assets/images/profileImage2.png";

const PrivacyPolicy = () => (
  <div className="py-5 px-10">
    <header
      className="flex items-center py-5 px-10"
      style={{
        background:
          "linear-gradient(90.07deg, rgba(153, 153, 255, 0) 0.05%, #9999FF 98.56%)",
      }}
    >
      <div
        className="p-3 rounded-lg"
        style={{ backgroundColor: "#E9E9FC", border: "1px solid #9999FF" }}
      >
        <img src={profileImage} alt="" className="h-5" />
      </div>
      <div className="font-bold text-xl border-r-1 px-4 mr-4">
        Privacy Policy
      </div>
      <div className="text-xs">Last Updated: 29-11-23</div>
    </header>

    <section style={{ width: "60vw" }}>
      <div className="py-5 px-4">
        <section className="mb-6">
          <h2 className="font-bold text-xs mb-2">1. Introduction</h2>
          <p className="text-xs">
            Welcome to Tubedominator! This Privacy Policy outlines how we
            collect, use, disclose, and safeguard your information when you use
            our services. Your privacy is of utmost importance to us, and we are
            committed to ensuring that your personal information is handled
            responsibly and securely.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-xs mb-2">2. Information We Collect</h2>

          <h3 className="font-bold text-xs mb-2">
            2.1 Generated Ideas Information:
          </h3>
          <p className="text-xs">
            When you use Tubedominator to discover video ideas, we collect and
            store information related to your generated ideas, including search
            volumes, keyword trends, and associated metrics. This data is
            utilized solely for providing personalized insights and enhancing
            your user experience.
          </p>

          <h3 className="font-bold text-xs mb-2">2.2 Competitor Metrics:</h3>
          <p className="text-xs">
            Tubedominator gathers aggregated competitor metrics to offer you a
            comprehensive analysis of your competition. This includes
            information on channel size, video length, likes, comments,
            subscribers, and other relevant metrics.
          </p>

          <h3 className="font-bold text-xs mb-2">
            2.3 Video Optimization Data:
          </h3>
          <p className="text-xs">
            In the process of providing AI-driven optimization guides,
            Tubedominator may analyze metadata from your existing YouTube posts.
            This information is used to generate customized checklists for
            improving your content strategy.
          </p>

          <h3 className="font-bold text-xs mb-2">
            2.4 User Account Information:
          </h3>
          <p className="text-xs">
            To enable features such as saving and categorizing ideas,
            Tubedominator may collect and store basic user account information.
            This includes usernames, email addresses, and other relevant details
            necessary for user account management.
          </p>

          <h3 className="font-bold text-xs mb-2">
            2.5 AI Model Interaction Consent:
          </h3>
          <p className="text-xs">
            Before proceeding with the account creation process, Tubedominator
            seeks your explicit consent to utilize AI models for enhancing your
            experience. This involves analyzing the search keywords you provide
            to generate personalized recommendations. This consent is crucial
            for tailoring our services to your preferences. By agreeing, you
            allow us to use this data for optimizing your content strategy and
            providing valuable insights.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-xs mb-2">
            3. How We Use Your Information
          </h2>

          <h3 className="font-bold text-xs mb-2">
            3.1 Personalized Recommendations:
          </h3>
          <p className="text-xs">
            The data collected is primarily used to offer you personalized
            recommendations, insights, and optimization guides based on your
            usage patterns within the Tubedominator platform.
          </p>

          <h3 className="font-bold text-xs mb-2">3.2 Account Management:</h3>
          <p className="text-xs">
            User account information is utilized for managing and enhancing your
            experience on Tubedominator, including features like saving and
            categorizing ideas.
          </p>

          <h3 className="font-bold text-xs mb-2">
            3.3 Consent for AI Model Interaction:
          </h3>
          <p className="text-xs">
            Tubedominator utilizes AI models to enhance your experience. Before
            sharing user search keywords with these AI models, explicit consent
            will be obtained from users through a separate consent process,
            ensuring transparency and user control. This consent will be
            independent of any permissions granted through Google OAuth.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-xs mb-2">4. Data Security</h2>
          <p className="text-xs">
            We prioritize the security of your information. Tubedominator
            employs industry-standard security measures to protect your data
            from unauthorized access, disclosure, alteration, and destruction.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-xs mb-2">5. Third-Party Disclosures</h2>
          <p className="text-xs">
            Tubedominator does not disclose your personal information to third
            parties unless required by law or in connection with services
            provided by third-party integrations expressly chosen by you.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-xs mb-2">6. Your Choices</h2>
          <p className="text-xs">
            You have the option to control the information you provide to the
            Tubedominator. You can update or delete your account information and
            preferences at any time.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-xs mb-2">
            7. Updates to This Privacy Policy
          </h2>
          <p className="text-xs">
            This Privacy Policy is subject to change. We will notify you of any
            material changes by posting the updated policy on our website or
            through other communication channels.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-xs mb-2">8. Contact Us</h2>
          <p className="text-xs">
            If you have any questions, concerns, or requests regarding your
            privacy or this Privacy Policy, please contact us at{" "}
            <a href="mailto:tubedominator@gmail.com" className="text-blue-500">
              tubedominator@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </section>
  </div>
);

export default PrivacyPolicy;
