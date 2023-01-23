import { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header, Footer } from "../components";
import { QAndA } from "../interfaces";
import dashboardStyles from "../styles/Dashboard.module.css";
import aboutStyles from "../styles/About.module.css";
// TODO: Assign images more specific name
import img1 from "./../public/example1.png";
import img2 from "./../public/example2.png";
import img3 from "./../public/example3.png";
import img4 from "./../public/example4.png";

function getQAndA({ question, answer }: QAndA) {
  return (
    <>
      <h3 style={{ textDecoration: "underline", marginBottom: 0 }}>
        {question}
      </h3>
      {answer}
    </>
  );
}

const About: NextPage = () => {
  const qAndAs = [
    {
      question: "What is songbook?",
      answer: (
        <p className={aboutStyles.answer}>
          I started songbook as a side-project in late 2022. Use songbook to
          discover music, or if you'd like, share a song - it can be anything
          that you'd like! If you have any questions or comments, feel free to
          message me at: hello.songbookapp(at)gmail.com.
        </p>
      ),
    },
    {
      question: "How do I share a song?",
      answer: (
        <>
          <h4>1.{")"} Get a Spotify song link</h4>
          <p className={aboutStyles.answer}>
            You'll first need to get a song link for your song from Spotify. To
            get the song link, go to Spotify and right-click the song you want
            to share (for mobile devices, select the three dots). From there,
            choose Share {">"} Copy Song Link.
          </p>
          <Image
            src={img1}
            alt="Example to show how to Copy a song link"
            style={{
              maxWidth: "100%",
              height: "auto",
              margin: "1rem 0 1rem",
            }}
            priority={true}
          />
          <h4>2.{")"} Add song link to songbook</h4>
          <p className={aboutStyles.answer}>
            Once the link is copied to your clipboard, go back to the songbook
            app, and paste the song link to the "Add a Song" form, and click
            "Add" .
          </p>
          <p className={aboutStyles.answer}>
            <b>Note:</b> If you don't see the "Add a Song" form, make sure{" "}
            <Link href="/auth/login" style={{ textDecoration: "underline" }}>
              you're logged in
            </Link>
            .
          </p>
          <Image
            src={img2}
            alt="Example to show how to add a song"
            style={{
              maxWidth: "100%",
              height: "auto",
              margin: "1rem 0 1rem",
            }}
          />
          <p className={aboutStyles.answer}>
            That's it! Once you add a song, we'll add a Spotify player for it to
            the timeline, along with your name and the shared date.
          </p>
          <Image
            src={img3}
            alt="Example to show how to add a song"
            style={{
              maxWidth: "100%",
              height: "auto",
              margin: "1rem 0 1rem",
            }}
          />
          <h4>3.{")"} (Optional) Manage your shared songs</h4>
          <p className={aboutStyles.answer}>
            You can always go to "Manage Songs" page to update or remove your
            shared songs.
          </p>
          <p className={aboutStyles.answer}>
            <b>Note:</b> If you don't see "Manage Songs" on the homepage, make
            sure{" "}
            <Link href="/auth/login" style={{ textDecoration: "underline" }}>
              you're logged in
            </Link>
            .
          </p>
          <Image
            src={img4}
            alt="Example to show how to Update or Remove songs"
            style={{
              maxWidth: "100%",
              height: "auto",
              margin: "1rem 0 1rem",
            }}
          />
        </>
      ),
    },
    {
      question: "Do you only support sharing Spotify songs?",
      answer: (
        <p className={aboutStyles.answer}>
          For now, only Spotify songs are supported.
        </p>
      ),
    },
    {
      question: "Can I listen to songs through songbook?",
      answer: (
        <p className={aboutStyles.answer}>
          Yep! Make sure you're logged into Spotify on your browser for the best
          experience. Unfortunately, if you're logged out, you can only preview
          songs.
        </p>
      ),
    },
    {
      question: "How do I manage the songs I've shared?",
      answer: (
        <p className={aboutStyles.answer}>
          To manage the songs you've shared, go to the Manage Songs page (make
          sure{" "}
          <Link href="/auth/login" style={{ textDecoration: "underline" }}>
            you're logged in
          </Link>
          ). From there, you have the option to update or remove songs.
        </p>
      ),
    },
  ];

  const returnHomeLink = <Link href="/">Home</Link>;

  return (
    <>
      <div className={dashboardStyles.container}>
        <Header returnHomeLink={returnHomeLink} />
        <h2 style={{ marginBottom: 0 }}>FAQ</h2>
        <main>
          <ul className={dashboardStyles.ul}>
            <li className={aboutStyles.li}>{getQAndA(qAndAs[0])}</li>
            <li className={aboutStyles.li}>{getQAndA(qAndAs[1])}</li>
            <li className={aboutStyles.li}>{getQAndA(qAndAs[2])}</li>
            <li className={aboutStyles.li}>{getQAndA(qAndAs[3])}</li>
            <li className={aboutStyles.li}>{getQAndA(qAndAs[4])}</li>
          </ul>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default About;
