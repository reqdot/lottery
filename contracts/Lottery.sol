pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;
    
    function Lottery() public {
        manager = msg.sender;
    }
    
    function enter() public payable {
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }
    
    function pickWinner() public restricted {
        // require(msg.sender == manager);
        
        uint index = random() % players.length;
        players[index].transfer(this.balance);
        // players array reset
        players = new address[](0);
    }
    
    function random() private view returns (uint256) {
        return uint(keccak256(block.difficulty, now, players));
        // sha3();
    }
    
    function getPlayers() public view returns (address[]) {
        return players;
    }
     
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
}