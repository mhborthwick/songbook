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

function getQAndA({ question, answer }: QAndA) {
  return (
    <>
      <h3>{question}</h3>
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
          I started songbook as a side-project in late 2022. I enjoy curating
          music, so I thought it'd be fun to create a place where people can
          share and discover music. If you have any questions or comments, feel
          free to message me at: hello.songbookapp(at)gmail.com.
        </p>
      ),
    },
    {
      question: "How do I share a song?",
      answer: (
        <>
          <p className={aboutStyles.answer}>
            You'll need to get a Spotify song link to share a song. To get a
            song link, go to Spotify and right-click the song you want to share
            (For mobile devices, select the three dots). From there, choose
            Share {">"} Copy Song Link.
          </p>
          <Image
            src={img1}
            alt="Example to show how to Copy a song link"
            style={{
              maxWidth: "100%",
              height: "auto",
              margin: "1rem 0 1rem",
            }}
          />
          Once the link is copied to your clipboard, go back to songbook (make
          sure you're logged in), and paste the song link to the Add a Song
          form, and click Add.
          <Image
            src={img2}
            alt="Example to show how to add a song"
            style={{
              maxWidth: "100%",
              height: "auto",
              margin: "1rem 0 1rem",
            }}
          />
          <p>
            That's it! Once you submit the song, we'll add a Spotify player to
            the timeline for it. Note that you can always go to Manage Songs to
            update or remove your shared songs.
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
        </>
      ),
    },
    {
      question: "Do you only support sharing Spotify songs?",
      answer: <p>For now, only Spotify songs are supported.</p>,
    },
    {
      question: "Can I listen to songs through songbook?",
      answer: (
        <p>
          Yep! Make sure you're logged into Spotify on your browser for the best
          experience. Unfortunately, if you're logged out, you can only preview
          the songs.
        </p>
      ),
    },
    {
      question: "How do I manage the songs I've shared?",
      answer: (
        <p>
          To manage the songs you've shared, go to the Manage Songs page (Make
          sure you're logged in). From there, you have the option to update or
          remove songs.
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
