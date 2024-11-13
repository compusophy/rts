import React, { useEffect } from 'react';
import Phaser from 'phaser';

// Define custom player type
interface CustomPlayer extends Phaser.GameObjects.Arc {
  velocityX: number;
  velocityY: number;
}

const PhaserGame = () => {
  useEffect(() => {
    const width = Math.min(500, window.innerWidth - 20);
    const height = Math.min(500, window.innerHeight - 20);

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: width,
      height: height,
      parent: 'phaser-game',
      backgroundColor: '#000000',
      scene: {
        create: function(this: Phaser.Scene) {
          const dots = this.add.group();
          
          const dotRadius = 3;        // Size of dots and initial player size
          const player = this.add.circle(width/2, height/2, dotRadius, 0xFFFFFF) as CustomPlayer;
          player.velocityX = 0;
          player.velocityY = 0;
          
          const maxSpeed = 0.5;
          const acceleration = 0.05;
          const friction = 0.99;
          
          const borderGraphics = this.add.graphics();
          borderGraphics.lineStyle(2, 0x808080);
          borderGraphics.strokeRect(0, 0, width, height);
          
          let score = 0;
          const scoreText = this.add.text(10, 10, `Score: ${score}`, {
            fontSize: '16px',
            color: '#FFFFFF'
          });
          
          // Growth constants
          const growthPerDot = 0.5;    // How much to grow per dot
          const maxRadius = 50;        // Maximum size limit
          
          // Create initial dots
          const numDots = 50;
          for (let i = 0; i < numDots; i++) {
            const x = Phaser.Math.Between(10, width - 10);
            const y = Phaser.Math.Between(10, height - 10);
            const dot = this.add.circle(x, y, dotRadius, 0xFFFFFF);
            dots.add(dot);
          }
          
          this.events.on('update', () => {
            const pointer = this.input.activePointer;
            
            const angle = Phaser.Math.Angle.Between(
              player.x,
              player.y,
              pointer.x,
              pointer.y
            );
            
            player.velocityX += Math.cos(angle) * acceleration;
            player.velocityY += Math.sin(angle) * acceleration;
            
            const currentSpeed = Math.sqrt(
              player.velocityX * player.velocityX + 
              player.velocityY * player.velocityY
            );
            
            if (currentSpeed > maxSpeed) {
              const scale = maxSpeed / currentSpeed;
              player.velocityX *= scale;
              player.velocityY *= scale;
            }
            
            player.velocityX *= friction;
            player.velocityY *= friction;
            
            player.x += player.velocityX;
            player.y += player.velocityY;
            
            if (player.x < 0) player.x = width;
            if (player.x > width) player.x = 0;
            if (player.y < 0) player.y = height;
            if (player.y > height) player.y = 0;
            
            dots.getChildren().forEach((dot: any) => {
              const distance = Phaser.Math.Distance.Between(
                player.x,
                player.y,
                dot.x,
                dot.y
              );
              
              if (distance < player.radius + dot.radius) {
                dot.destroy();
                score += 10;
                scoreText.setText(`Score: ${score}`);
                
                // Grow the player
                const newRadius = Math.min(
                  player.radius + growthPerDot,
                  maxRadius
                );
                player.setRadius(newRadius);
                
                const newDot = this.add.circle(
                  Phaser.Math.Between(10, width - 10),
                  Phaser.Math.Between(10, height - 10),
                  dotRadius,
                  0xFFFFFF
                );
                dots.add(newDot);
              }
            });
          });
        }
      }
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div 
      id="phaser-game" 
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        margin: 0,
        padding: 0,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    />
  );
};

export default PhaserGame;