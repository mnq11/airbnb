import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";

const PrivacyPolicy = () => {
  const deleteEmail = "mnq_11@yahoo.com";
  const deleteRequestDuration = "48 hours";

  return (
    <ClientOnly>
      <div>
        <h1>Privacy Policy</h1>

        <h2>1. Types of Information</h2>
        <p>We may collect the following types of personal information:</p>
        <ul>
          <li>
            Email address: We collect your email address for the purpose of
            communication and account management.
          </li>
          <li>
            Password: We securely store your password to authenticate your
            account.
          </li>
          <li>
            Posts: If you create posts on our platform, we may collect and store
            the content of those posts.
          </li>
        </ul>

        <h2>2. Data Usage and Sharing</h2>
        <p>We use the collected information for the following purposes:</p>
        <ul>
          <li>
            Email address: We use your email address to send important
            notifications and updates related to your account.
          </li>
          <li>
            Password: Your password is securely stored and encrypted to protect
            the integrity of your account.
          </li>
          <li>
            Posts: The content of your posts is stored and displayed publicly on
            our platform as per your intended usage.
          </li>
        </ul>

        <h2>3. Data Security</h2>
        <p>
          We take appropriate measures to ensure the security of your personal
          information. This includes implementing strict access controls,
          encryption, and regular security audits.
        </p>

        <h2>4. Data Retention and Deletion</h2>
        <p>
          We retain your personal information for as long as necessary to
          fulfill the purposes outlined in this privacy policy. If you wish to
          delete your account and associated data, please contact our support
          team at <a href={`mailto:${deleteEmail}`}>{deleteEmail}</a> and your
          request will be processed within {deleteRequestDuration}.
        </p>

        <p>
          Please note that this is a general overview of our privacy policy. For
          more detailed information and to understand your rights and choices
          regarding your personal information, please refer to our complete
          privacy policy available on our website.
        </p>
      </div>
    </ClientOnly>
  );
};

export default PrivacyPolicy;
