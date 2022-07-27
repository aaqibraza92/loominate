import { Modal, ModalProps } from "antd";
import { useEffect, useState } from "react";
import "./styles.scss";

export enum ModalConfirmType {
  Default = "",
  Danger = "danger",
}

interface Props extends ModalProps {
  visible?: boolean;
  onClose?: any;
}

/**
 * ModalConfirm Component
 * @param { Props} props
 * @returns JSX.Element
 */
function FAQsModal(props: Props) {
  const { visible, onClose } = props;
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);
  const handleOk = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const handleCancel = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  return (
    <Modal
      className="faqs-modal"
      visible={isVisible}
      centered
      footer={null}
      afterClose={onClose}
      onCancel={handleCancel}
    >
      <div className="c7">
        <h2 className="c7 c14" id="h.55jdiam95vy6">
          <span className="c4">Sign Up</span>
        </h2>
        <h3 className="c3" id="h.12buipigpl2x">
          <span className="c1">How do I join Loominate?</span>
        </h3>
        <p className="c2">
          <span className="c0">
            You&rsquo;ll need to verify a work email to join Loominate.
            Verifying a valid work email will give you access to the private
            space for your company.
          </span>
        </p>
        <p className="c2">
          <span className="c0">
            To create an account, enter your email address in the Email
            Verification field. After verifying you belong to the organization
            you will be able to create a username (pseudonym) and password.
          </span>
        </p>
        <h3 className="c3" id="h.oh11bl5e0hc7">
          <span className="c1">
            Why do I need to verify a work email to get access?
          </span>
        </h3>
        <p className="c2">
          <span className="c0">
            A core part of our service is to build and maintain a community of
            verified professionals belonging to your organization.
          </span>
        </p>
        <p className="c2">
          <span className="c0">
            If you are worried about security, we&rsquo;d like you to know that
            emails are not connected to accounts. You&rsquo;ll also never
            receive messages from Loominate unless requested. To learn more,
            check out the Privacy and Security section of this FAQ.
          </span>
        </p>
        <h3 className="c3" id="h.59b1pic9q12e">
          <span className="c1">
            I didn&rsquo;t receive a verification code. How do I complete the
            sign-up process?
          </span>
        </h3>
        <p className="c2">
          <span className="c9">
            Make sure you check your spam folder. If you still can&rsquo;t find
            the verification code, email us at{" "}
          </span>
          <span className="c11">hello@loominate.com</span>
          <span className="c0">
            . If your company is blocking incoming or outgoing messages to
            Loominate, you can write to us from your personal email address.
          </span>
        </p>
        <h2 className="c13 c7" id="h.4zeufxlo3hnt">
          <span className="c4">Using Loominate</span>
        </h2>
        <h3 className="c3" id="h.ahg9bryw41k4">
          <span className="c15 c17">What features are offered?</span>
        </h3>
        <p className="c2">
          <span className="c0">
            Loominate provides a forum where you can connect and discuss all
            things work-related with other colleagues. There are 4 interactions:
          </span>
        </p>
        <ul className="c20 lst-kix_xsw47a9xmcfj-0 start">
          <li className="c18 li-bullet-0">
            <span className="c8">
              General discussions: to share knowledge, seek advice and ideate.
            </span>
          </li>
          <li className="c18 li-bullet-0">
            <span className="c8">
              Polls: to facilitate votes on issues and ideas.
            </span>
          </li>
          <li className="c18 li-bullet-0">
            <span className="c8">
              Initiatives: to launch ideas for organizational improvement, gain
              support from colleagues and bring visibility to solutions.
            </span>
          </li>
          <li className="c18 li-bullet-0">
            <span className="c8">
              Private Log: To journal sentiments, concerns and experiences such
              as misconduct or mental health struggles. You will be able to see
              how many others in the company are logging similar issues.
            </span>
          </li>
        </ul>
        <p className="c2">
          <span className="c0">
            Additional features include: group chats, 1:1 conversations and
            engagement with management (for companies subscribed to the
            platform). Please note that some features are still being rolled
            out.
          </span>
        </p>
        <h3 className="c3" id="h.rb54tqr9c77l">
          <span className="c1">Why don&rsquo;t I have a company channel?</span>
        </h3>
        <p className="c2">
          <span className="c0">
            Company forums are unlocked when a minimum of 30 employees join.
            Each company must also meet certain criteria to be eligible for
            activation.
          </span>
        </p>
        <h2 className="c13 c7" id="h.qd51v0xdvxwi">
          <span className="c4">Community Standards</span>
        </h2>
        <h3 className="c3" id="h.45qp3kupraba">
          <span className="c15 c17">What are the community policies?</span>
        </h3>
        <p className="c2">
          <span className="c9">
            In order to have a sustainable community, we require all members to
            abide by our{" "}
          </span>
          <span className="c5">Community Guidelines</span>
          <span className="c0">
            . We encourage everyone to reference our policies when writing and
            reporting content.
          </span>
        </p>
        <h3 className="c3" id="h.dmlb35fcvkly">
          <span className="c1">How do I report content?</span>
        </h3>
        <p className="c2">
          <span className="c9">
            Select the three dot icon (&bull; &bull; &bull;) on the post or
            comment you wish to report. Choose the option to Flag Content and
            provide a reason. You can always reference our{" "}
          </span>
          <span className="c5">Community Guidelines</span>
          <span className="c0">&nbsp;when reporting content.</span>
        </p>
        <h3 className="c3" id="h.c8f9nb4ph80l">
          <span className="c1">How does Loominate moderate the community?</span>
        </h3>
        <p className="c2">
          <span className="c0">
            Loominate uses both AI moderation and community self-moderation.
            Posts are automatically removed based on the flags received. Please
            note that every flag is weighed differently based on its category. A
            specific number of flags is not the sole criteria for removal of
            content.
          </span>
        </p>
        <p className="c2">
          <span className="c0">
            Human moderation does take place for certain cases that are brought
            to our attention. If you request for our involvement, please flag
            the content that you&rsquo;d like us to review. This helps expedite
            the review process.
          </span>
        </p>
        <p className="c2">
          <span className="c0">
            Users are subject to account restrictions when their content is
            removed. Repeat offenses or posting extremely inappropriate content
            can lead to a permanent restriction.
          </span>
        </p>
        <h2 className="c7 c13" id="h.x3ll5ggdy4jd">
          <span className="c4">Account Management</span>
        </h2>
        <h3 className="c3" id="h.h0vyn5dwgrl6">
          <span className="c1">How do I change my username?</span>
        </h3>
        <p className="c2">
          <span className="c0">
            Usernames can only be updated on the app. Go to Account &gt; Edit
            &gt; Username. You can change your username once per day.
          </span>
        </p>
        <h3 className="c3" id="h.3wpn7ld3u2g8">
          <span className="c1">How do I change my password?</span>
        </h3>
        <p className="c2">
          <span className="c0">
            Passwords can only be updated on the app. Go to Account &gt;
            Settings &gt; Change Password.
          </span>
        </p>
        <h3 className="c3" id="h.rmwldyr2nbmj">
          <span className="c1">
            I forgot my password. Can you help me retrieve it?
          </span>
        </h3>
        <p className="c2">
          <span className="c0">
            We are unable to retrieve passwords due to certain security
            constraints that are meant to protect your anonymity. To access
            Loominate, you will need to create a new account.
          </span>
        </p>
        <h3 className="c3" id="h.pziut8w08dpb">
          <span className="c1">
            Why am I being prompted to re-verify my email?
          </span>
        </h3>
        <p className="c2">
          <span className="c0">
            We ask users to re-verify emails on a periodic basis. This allows us
            to update each user&rsquo;s employment status and it allows us to
            give each user access to the appropriate channels.
          </span>
        </p>
        <h3 className="c3" id="h.z9x10gic8th">
          <span className="c1">How do I delete my posts?</span>
        </h3>
        <p className="c2">
          <span className="c0">
            Select the three dot icon (&bull; &bull; &bull;) on any post you
            wish to remove, then choose to delete. Deleting will permanently
            remove your content from Loominate.
          </span>
        </p>
        <h3 className="c3" id="h.9z6z5lh0guiq">
          <span className="c1">How do I delete my account?</span>
        </h3>
        <p className="c2">
          <span className="c9">Email us at </span>
          <span className="c11">hello@loominate.com</span>
          <span className="c0">
            . Please provide your username when you submit your request.
          </span>
        </p>
        <h2 className="c13 c7" id="h.31765nzdn8rz">
          <span className="c4">Privacy and Security</span>
        </h2>
        <h3 className="c3" id="h.pp1rbkiz84fl">
          <span className="c1">
            Will my employer know that I&rsquo;m on Loominate if I verify my
            work email?
          </span>
        </h3>
        <p className="c2">
          <span className="c0">
            Your employer will not know that you&rsquo;re on Loominate if you
            decide to join.
          </span>
        </p>
        <p className="c2">
          <span className="c0">
            If your employer monitors company email accounts, it&rsquo;s
            possible for them to find out whether or not you requested a
            verification code. However, receiving a verification code does not
            mean that you have an account with us. There are additional steps
            that must be taken to set up an account. Once an account is set up,
            we never send out a confirmation email.
          </span>
        </p>
        <h3 className="c3" id="h.ttnfvozepqu5">
          <span className="c1">Can I be identified if I join Loominate?</span>
        </h3>
        <p className="c2">
          <span className="c0">
            The only information that&rsquo;s required when joining is an email
            address. Emails are one-way hashed, salted and encrypted. Accounts
            are stored on a separate server from hashed email addresses. This
            means that your activity will never be connected to your email. Your
            name will not even be connected to your account since we never ask
            for this information. In short, you will be anonymous, even to our
            team members.
          </span>
        </p>
        <p className="c2">
          <span className="c0">
            To further protect your anonymity, we ask that you not share
            personally identifiable information with other users. With enough
            details, they may be able to find out your identity.
          </span>
        </p>
        <h3 className="c3" id="h.rsb6byf5zdcw">
          <span className="c1">
            Where can I find your Terms of Use and Privacy Policy?
          </span>
        </h3>
        <p className="c2">
          <span className="c9">You can find them here on our website: </span>
          <span className="c5">Terms of Use</span>
          <span className="c9">&nbsp;and </span>
          <span className="c5">Privacy Policy</span>
          <span className="c0">
            . To find them on the app, go to the verification screen or locate
            them by going to Account &gt; Settings.
          </span>
        </p>
        <p className="c2 c19">
          <span className="c0"></span>
        </p>
        <p className="c2">
          <span className="c9">Still need help? Contact us at </span>
          <span className="c11 c15">hello@loominate.org</span>
        </p>
        <p className="c6 c7">
          <span className="c15 c16"></span>
        </p>
        <p className="c6">
          <span className="c10"></span>
        </p>
        <p className="c6">
          <span className="c10"></span>
        </p>
      </div>
    </Modal>
  );
}

export default FAQsModal;
