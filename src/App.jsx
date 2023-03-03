import { useEffect, useState } from "react";

import {
  urlClient,
  LENS_HUB_CONTRACT_ADDRESS,
  queryRecommendedProfiles,
  queryExplorepublications,
} from "./queries";

import LENSHUB from "./lenshub.json";

import { ethers } from "ethers";

import { Box, Button, Image } from "@chakra-ui/react";

function App() {
  const [account, setAccount] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [posts, setPosts] = useState([]);

  async function signIn() {
    const accounts = await window.ethereum.request({
      method: "",
    });

    setAccount(accounts[0]);
  }

  async function getRecommendedProfiles() {
    const response = await urlClient
      .query(queryRecommendedProfiles)
      .toPromise();

    const profiles = response.data.recommendedProfiles.slice(0, 5);

    setProfiles(profiles);
  }

  async function getPosts() {
    const response = await urlClient
      .query(queryExplorepublications)
      .toPromise();
    const posts = response.data.explorePublications.items.filter((post) => {
      if (post.profile) return post;
      return "";
    });

    setPosts(posts);
  }

  async function follow(id) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      LENS_HUB_CONTRACT_ADDRESS,
      LENSHUB,
      provider.getSigner()
    );

    const tx = await contract.follow([parseInt(id)], [0x0]);
    await tx.wait();
  }

  useEffect(() => {
    getRecommendedProfiles();
    getPosts();
  }, []);

  return (
    <div>
      <Box width="100%" backgroundColor="rgba(5,32,64,8)">
        <Box display="flex" justifyContent="space-between"></Box>
      </Box>
    </div>
  );
}

export default App;
