import { Modal, ModalProps } from "antd";
import { useEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import Div100vh from "react-div-100vh";
import { useDispatch, useSelector } from "react-redux";
import images from "../../assets/images/images";
import User from "../../models/user.model";
import authAction from "../../redux/actions/auth.action";
import userService from "../../services/user.service";
import ButtonGradient from "../button/ButtonGradient";
import "./styles.scss";

interface Props extends ModalProps {
  visible?: boolean;
  loading?: boolean;
  selected?: any;
  onClose?: any;
}

/**
 * CategorySelectModal Component
 * @param { Props} props
 * @returns JSX.Element
 */
function CompanyGuideModal(props: Props) {
  const { visible, onClose } = props;
  const user: User = useSelector((state: any) => state.auth.user);
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  const handleCancel = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const handleAgree = async () => {
    handleCancel();
    try {
      if (!user.agreed_community_guidelines) {
        const rs = await userService.updateUser(user.id, {
          agreed_community_guidelines: true,
        });
        dispatch(authAction.updateUser(rs.user));
      }
    } catch (error) {}
  };

  return (
    <Modal
      className="company-guide-modal"
      zIndex={1200}
      visible={isVisible}
      centered
      closable={false}
      footer={null}
      afterClose={onClose}
      onCancel={handleCancel}
    >
      <Div100vh>
        <Stack className="v-head align-items-center justify-content-center">
          <img src={images.banderGuide} />
        </Stack>
        <div className="card">
          <h3 className="text-title">The community guidelines</h3>
          <h2 className="c12" id="h.h3qfdafidpza">
            <span className="c4">
              At Loominate, we want to foster a diverse and transparent space
              that gives an equitable voice to every member of our community. In
              order to do this, we need to create an online space where every
              member can feel welcome and free to express their full authentic
              self.
            </span>
          </h2>
          <p className="c1">
            <span className="c3">
              While we are a self-moderating community, we also have clear
              values that we want to uphold. Here are some human guidelines
              that&rsquo;ll help you steer away from trouble and will help us
              create a healthy and vibrant community. Please refer to these
              guidelines when writing and flagging posts.
            </span>
          </p>
          <h3 className="c0" id="h.5mgga6oodc5l">
            <span className="c4">Bullying or Harassment</span>
          </h3>
          <p className="c1">
            <span className="c3">
              We want you to use Loominate without fear of being subjected to
              malicious harassment or threats. Posts that become a malicious
              attack should be flagged. Mildly annoying posts can be ignored.
            </span>
          </p>
          <p className="c1">
            <span className="c3">Harassment may include:</span>
          </p>
          <ul className="c9 lst-kix_u7whvf4zykhg-0 start">
            <li className="c1 c2 li-bullet-0">
              <span className="c3">
                Comments that are meant to humiliate, hurt or attack someone
              </span>
            </li>
            <li className="c1 c2 li-bullet-0">
              <span className="c3">Sexualization of individuals</span>
            </li>
            <li className="c1 c2 li-bullet-0">
              <span className="c3">Incitement to bully others</span>
            </li>
          </ul>
          <p className="c8">
            <span className="c3">&#8203;&#8203;</span>
          </p>
          <h3 className="c0" id="h.c9oe66z75b4j">
            <span className="c4">Discrimination or Hate Speech</span>
          </h3>
          <p className="c1">
            <span className="c3">
              We encourage free speech and believe in the right to express
              different views. However, we do not permit hate speech and
              discrimination. Hate speech refers to content that promotes
              violence against people or has the primary purpose of inciting
              hostility against others based on certain attributes. These
              attributes may include ethnicity, religion, disability, age,
              veteran status, sexual orientation, gender or gender identity.
            </span>
          </p>
          <p className="c1">
            <span className="c3">
              &#8203;Keep in mind that a post might be mean, tasteless, or
              offensive without necessarily encouraging violence or hatred. In
              cases like that, you can always block the person who made the
              post&mdash;or, if you&#39;re up for it, you can express your
              concerns to them directly, or use Loominate to speak up, challenge
              ideas, raise awareness or generate discussion and debate.&#8203;
            </span>
          </p>
          <h3 className="c0" id="h.eip9jzx9nxns">
            <span className="c4">Trolling</span>
          </h3>
          <p className="c1">
            <span className="c3">
              We enjoy and encourage playful jokes on Loominate. We do not
              encourage trolling, which can include writing random posts with
              the intent to provoke readers and leaving comments that don&#39;t
              add value to a conversation. If the community flagged your posts
              as such, your posts will be subject to removal and repeated
              behaviour may cause you to be permanently banned from the
              platform.
            </span>
          </p>
          <h3 className="c0" id="h.5pz0u4l2k1s2">
            <span className="c4">Company Secrets</span>
          </h3>
          <p className="c1">
            <span className="c3">
              Your space is restricted to people who have been verified to
              belong to your organization. Nevertheless, please be mindful of
              sharing sensitive company information which maybe copied or
              recorded by other users in the same community. We believe that it
              is up to the employees to properly manage this information through
              flagging.&#8203;
            </span>
          </p>
          <h3 className="c0" id="h.dwldhkxmio2d">
            <span className="c4">Spam</span>
          </h3>
          <p className="c1">
            <span className="c3">
              We ask that you do not post the same content multiple times. We
              also don&rsquo;t condone promoting or selling on our platform.
              This may include services, products and animals. Propaganda should
              be flagged, as well as any posts that merely push out opinions and
              ideas without eliciting a constructive discussion.
            </span>
          </p>
          <h3 className="c0" id="h.24vop72ucata">
            <span className="c4">Invasion of Privacy</span>
          </h3>
          <p className="c1">
            <span className="c3">
              We do not condone any attempts to guess at or reveal the
              identities of other individuals. Revealing personally identifiable
              information is unacceptable. These details can include photos,
              names and sometimes initials. The only mentions we will allow are
              the names of company executives, public figures and the names of
              people who have been mentioned in the press.
            </span>
          </p>
          <p className="c1">
            <span className="c3">
              &#8203;If you wish to express critical opinions about company
              executives, we ask that you do so constructively. Bullying,
              unsupported accusations, doxxing, harassment and other
              inappropriate behavior will not be tolerated.
            </span>
          </p>
          <h3 className="c0" id="h.s8hkzml4xul7">
            <span className="c4">Impersonation</span>
          </h3>
          <p className="c8">
            <span className="c3">
              Don&#39;t do things that may cause confusion between your user
              identity and another user (real or virtual), organization, or
              company. Don&#39;t impersonate anyone. False representation could
              get you in hot water and you open yourself to libel suits filed
              against you by the relevant parties.
            </span>
          </p>
          <h3 className="c0" id="h.29ufwx7mlc6b">
            <span className="c4">Inappropriate Content</span>
          </h3>
          <p className="c1">
            <span className="c3">
              Pornography, explicitly sexual content and content that may make
              others feel deeply uncomfortable are not acceptable. The
              occasional impassioned swearing is fine but don&rsquo;t do it
              excessively. Let us be considerate towards users from cultures and
              norms that may be more or less conservative than the one you come
              from.
            </span>
          </p>
          <h3 className="c0" id="h.isj303gkhfh7">
            <span className="c4">Topic Relevance</span>
          </h3>
          <p className="c1">
            <span className="c3">
              Content should be posted in relevant channels. Any post that is
              not in the appropriate channel can be flagged.
            </span>
          </p>
          <p className="c8">
            <span className="c6">&nbsp;</span>
            <span className="c4">Terrorism</span>
          </p>
          <p className="c1">
            <span className="c3">
              &nbsp;We don&#39;t tolerate content that promotes, encourages, or
              incites acts of terrorism. That includes content which supports or
              celebrates terrorist organisations, their leaders, or associated
              violent activities.
            </span>
          </p>
          <p className="c7">
            <span className="c4">Harm to Minors</span>
          </p>
          <p className="c1">
            <span className="c3">
              Don&#39;t post or solicit content that features or that implies
              the abuse of a minor, that includes suggestive or sexual content
              involving a minor or anyone that appears to be a minor, or that
              facilitates or promotes child sexual abuse. &quot;Content&quot;
              may include photos of real individuals, illustrations, animation,
              or text. We will not hesitate to report all such instances to
              child protection organisations and law enforcement around the
              world.
            </span>
          </p>
          <p className="c8">
            <span className="c6">&nbsp;</span>
            <span className="c4">Promotion or Glorification of Self-Harm</span>
          </p>
          <p className="c1">
            <span className="c3">
              Don&#39;t post content that promotes self-harm of any kind. This
              includes content that encourages others to: cut or injure
              themselves; embrace anorexia, bulimia, or other eating disorders;
              or commit suicide rather than seeking counselling or treatment, or
              joining together in supportive conversation with those suffering
              or recovering from depression or other conditions. We can have
              mature conversations about such topics as mental health and online
              communities can be extraordinarily helpful to people struggling
              with these difficult conditions. We aim for Loominate to be a
              place that facilitates awareness, support and recovery, and we
              will remove only those posts or blogs that cross the line into
              active promotion or glorification of self-harm.
            </span>
          </p>
          <p className="c8">
            <span className="c6">&nbsp;</span>
            <span className="c4">Adult Content </span>
          </p>
          <p className="c1">
            <span className="c3">
              Do not upload images, videos, or GIFs that show real-life human
              genitals or female-presenting nipples &mdash;this includes content
              that is so photorealistic that it could be mistaken for featuring
              real-life humans. Certain types of artistic, educational,
              newsworthy, or political content featuring nudity are fine.
              Don&rsquo;t upload any content, including images, videos, GIFs, or
              illustrations, that depicts sex acts.
            </span>
          </p>
          <p className="c7">
            <span className="c4">
              Violent Content and Threats, Gore and Mutilation{" "}
            </span>
          </p>
          <p className="c1">
            <span className="c3">
              Do not post content which includes violent threats toward
              individuals or groups - this includes threats of identity theft,
              privacy violation, &nbsp;property damage, or financial harm.
              Don&#39;t post violent content or gore just to be shocking.
              Don&#39;t post content that encourages or incites violence, or
              glorifies acts of violence or the perpetrators. The tolerance for
              such content varies among community groups and your Contributions
              on the platform are subject to not just these guidelines but also
              the collective judgment of the community.
            </span>
          </p>
          <p className="c7">
            <span className="c4">Mass Registration or Automation </span>
          </p>
          <p className="c1">
            <span className="c3">
              Do not register accounts or post content automatically,
              systematically, or programmatically.
            </span>
          </p>
          <p className="c1">
            <span className="c3">
              If you see any content that violates what we stand for, please
              flag it for removal. Users who do not uphold our guidelines will
              be temporarily restricted and repeat offenders will be permanently
              banned from using our service. Each of you are an important member
              of the community and you help shape the conversations on
              Loominate. The words you write and the actions you take matter and
              are representative of your organization&#39;s culture.
            </span>
          </p>
          <p className="c11">
            <span className="c5"></span>
          </p>
          <p className="c11">
            <span className="c5"></span>
          </p>
        </div>
        <Stack className="box-bottom" onClick={handleAgree}>
          <ButtonGradient>{user?.agreed_community_guidelines? `I've agreed to Community Guidelines` : `I UNDERSTAND THE GUIDELINES`}</ButtonGradient>
        </Stack>
      </Div100vh>
    </Modal>
  );
}

export default CompanyGuideModal;
