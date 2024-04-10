import Users from "./Users";

const AllUsers = () => {
  return (
    <div>
      <Users
        userCat={"All"}
        addUserCTA="Create a User Account"
        userPageTitle="All Users"
      />
    </div>
  );
};

export default AllUsers;
