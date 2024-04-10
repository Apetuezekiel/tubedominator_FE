import Users from "./Users";

const PremiumUsers = () => {
  return (
    <div>
      <Users
        userCat={"Premium"}
        addUserCTA="Create Premium User Account"
        userPageTitle="Premium Users"
      />
    </div>
  );
};

export default PremiumUsers;
